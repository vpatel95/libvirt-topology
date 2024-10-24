#!/bin/bash

set -e

function usage() {
    echo "Usage: "
    echo -e "\tbash ${0} <bridge_name> <bridge_addr> <bridge_netmask> <dhcp_start> <dhcp_end>"
    echo -e "\t\tbridge_name : string"
    echo -e "\t\tbridge_addr : X.X.X.X"
    echo -e "\t\tbridge_netmask : X.X.X.X"
    echo -e "\t\tdhcp_start : X.X.X.X"
    echo -e "\t\tdhcp_end : X.X.X.X"
}

if [[ "$#" -ne 5 ]]; then
    usage
    exit 1
fi

set -x
# Read from config
BR_NAME=${1}
BR_ADDR=${2}
BR_NETMASK=${3}
BR_START_IP=${4}
BR_END_IP=${5}


if [[ ! -f "/etc/libvirt/qemu/networks/${BR_NAME}.xml" ]]; then
sudo tee -a /etc/libvirt/qemu/networks/${BR_NAME}.xml > /dev/null << EOF
<network>
    <name>${BR_NAME}</name>
    <bridge name='${BR_NAME}' stp='on' delay='0' />
    <ip address='${BR_ADDR}' netmask='${BR_NETMASK}' >
        <dhcp>
            <range start='${BR_START_IP}' end='${BR_END_IP}' />
        </dhcp>
    </ip>
</network>
EOF
fi

if [[ -f "/etc/libvirt/qemu/networks/${BR_NAME}.xml" ]]; then
    echo "File found /etc/libvirt/qemu/networks/${BR_NAME}.xml"
    exit
else
    sudo virsh net-define /etc/libvirt/qemu/networks/${BR_NAME}.xml
    sudo virsh net-start ${BR_NAME}
    sudo virsh net-autostart ${BR_NAME}
fi

set +xe
