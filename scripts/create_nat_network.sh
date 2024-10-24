#!/bin/bash

set -e

function usage() {
    echo "Usage: "
    echo -e "\tbash ${0} <bridge_name> <bridge_subnet> <bridge_addr> <dhcp_start> <dhcp_end> <broadcast>"
    echo -e "\t\tbridge_name : string"
    echo -e "\t\tbridge_subnet : X.X.X.X/mask"
    echo -e "\t\tbridge_addr : X.X.X.X"
    echo -e "\t\tdhcp_start : X.X.X.X"
    echo -e "\t\tdhcp_end : X.X.X.X"
    echo -e "\t\tbroadcast : X.X.X.255"
}

if [[ "$#" -ne 6 ]]; then
    usage
    exit 1
fi

set -x
# Read from config
BR_NAME=${1}
DUMMY_INTF="${BR_NAME}-nic"
BR_SUBNET=${2}
BR_ADDR=${3}
BR_START_IP=${4}
BR_END_IP=${5}
BR_BROADCAST_IP=${5}

# static
MAC_ADDR=$(hexdump -vn3 -e '/3 "52:54:00"' -e '/1 ":%02x"' -e '"\n"' /dev/urandom)
IP4_FORWARD=$(cat /proc/sys/net/ipv4/ip_forward)
IP4_CONF_FORWARDING=$(cat /proc/sys/net/ipv4/conf/all/forwarding)
IP6_CONF_FORWARDING=$(cat /proc/sys/net/ipv6/conf/all/forwarding)

if [[ ! -d "/opt/topology-deployer/bridges/${BR_NAME}" ]]; then
    sudo ip link add ${DUMMY_INTF} address ${MAC_ADDR} type dummy
    sudo brctl addbr ${BR_NAME}
    sudo brctl stp ${BR_NAME} on
    sudo brctl addif ${BR_NAME} ${DUMMY_INTF}
    sudo ip address add ${BR_ADDR}/24 dev ${BR_NAME} broadcast ${BR_BROADCAST_IP}
    sudo ip -6 addr add 1234::${BR_ADDR}/120 dev ${BR_NAME}
    sudo ip link set dev ${DUMMY_INTF} up
    sudo ip link set dev ${BR_NAME} up

    if [[ "$IP4_FORWARD" != "1" ]]; then
        sudo sh -c 'echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf'
    fi

    if [[ "$IP4_CONF_FORWARDING" != "1" ]]; then
        sudo sh -c 'echo "net.ipv4.conf.all.forwarding=1" >> /etc/sysctl.conf'
    fi

    if [[ "$IP6_CONF_FORWARDING" != "1" ]]; then
        sudo sh -c 'echo "net.ipv6.conf.all.forwarding=1" >> /etc/sysctl.conf'
    fi

    sudo sysctl -p

    # DHCP packets sent to VMs have no checksum (due to a longstanding bug).
    sudo iptables -t mangle -A POSTROUTING -o ${BR_NAME} -p udp -m udp --dport 68 -j CHECKSUM --checksum-fill

    # Do not masquerade to these reserved address blocks.
    sudo iptables -t nat -A POSTROUTING -s ${BR_SUBNET} -d 224.0.0.0/24 -j RETURN
    sudo iptables -t nat -A POSTROUTING -s ${BR_SUBNET} -d 255.255.255.255/32 -j RETURN
    # Masquerade all packets going from VMs to the LAN/Internet.
    sudo iptables -t nat -A POSTROUTING -s ${BR_SUBNET} ! -d ${BR_SUBNET} -p tcp -j MASQUERADE --to-ports 1024-65535
    sudo iptables -t nat -A POSTROUTING -s ${BR_SUBNET} ! -d ${BR_SUBNET} -p udp -j MASQUERADE --to-ports 1024-65535
    sudo iptables -t nat -A POSTROUTING -s ${BR_SUBNET} ! -d ${BR_SUBNET} -j MASQUERADE

    # # Allow basic INPUT traffic.
    # sudo iptables -t filter -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
    # sudo iptables -t filter -A INPUT -i lo -j ACCEPT
    # sudo iptables -t filter -A INPUT -p icmp --icmp-type 8 -m conntrack --ctstate NEW -j ACCEPT
    # # Accept SSH connections.
    # sudo iptables -t filter -A INPUT -p tcp -m tcp --syn -m conntrack --ctstate NEW --dport 22 -j ACCEPT
    # Accept DNS (port 53) and DHCP (port 67) packets from VMs.
    sudo iptables -t filter -A INPUT -i ${BR_NAME} -p udp -m udp -m multiport --dports 53,67 -j ACCEPT
    sudo iptables -t filter -A INPUT -i ${BR_NAME} -p tcp -m tcp -m multiport --dports 53,67 -j ACCEPT

    # Allow established traffic to the private subnet.
    sudo iptables -t filter -A FORWARD -d ${BR_SUBNET} -o ${BR_NAME} -j ACCEPT
    # Allow outbound traffic from the private subnet.
    sudo iptables -t filter -A FORWARD -s ${BR_SUBNET} -i ${BR_NAME} -j ACCEPT
    # Allow traffic between virtual machines.
    sudo iptables -t filter -A FORWARD -i ${BR_NAME} -j ACCEPT
    sudo iptables -t filter -A FORWARD -o ${BR_NAME} -j ACCEPT

    sudo sh -c 'iptables-save > /etc/iptables/rules.v4'

    sudo mkdir -p /var/lib/dnsmasq/${BR_NAME}
    sudo touch /var/lib/dnsmasq/${BR_NAME}/hostsfile
    sudo touch /var/lib/dnsmasq/${BR_NAME}/leases
    sudo touch /var/lib/dnsmasq/${BR_NAME}/dnsmasq.conf

    sudo tee -a /var/lib/dnsmasq/${BR_NAME}/dnsmasq.conf > /dev/null << EOF
except-interface=lo
interface=${BR_NAME}
bind-dynamic

dhcp-range=${BR_START_IP},${BR_END_IP}
dhcp-lease-max=1000
dhcp-leasefile=/var/lib/dnsmasq/${BR_NAME}/leases
dhcp-hostsfile=/var/lib/dnsmasq/${BR_NAME}/hostsfile
dhcp-no-override
strict-order
EOF

    sudo touch /etc/dnsmasq.d/${BR_NAME}.conf
    sudo sh -c 'echo "except-interface='${BR_NAME}'" >> /etc/dnsmasq.d/'${BR_NAME}'.conf'
    sudo sh -c 'echo "bind-interfaces" >> /etc/dnsmasq.d/'${BR_NAME}'.conf'

    if [[ ! -f "/etc/systemd/system/dnsmasq@.service" ]]; then
        sudo touch /etc/systemd/system/dnsmasq@.service
        sudo tee -a /etc/systemd/system/dnsmasq@.service > /dev/null << EOF
[Unit]
Description=DHCP and DNS caching server for %i.
After=network.target

[Service]
ExecStart=/usr/sbin/dnsmasq -k --conf-file=/var/lib/dnsmasq/%i/dnsmasq.conf
ExecReload=/bin/kill -HUP \$MAINPID
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

    fi

    sudo systemctl enable dnsmasq@${BR_NAME}.service
    sudo systemctl start dnsmasq@${BR_NAME}.service

    sudo mkdir -p  "/opt/topology-deployer/bridges/${BR_NAME}"
else
    echo "Bridge already setup. Restarting dnsmasq"
    sudo systemctl restart dnsmasq@${BR_NAME}.service
fi

set +xe
