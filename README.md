# libvirt-topology
Scripts to facilitate creating vm based topology using libvirt

## Table of Contents
1. [Prerequisites](#prereq)
2. [Network](#network_types)
    1. [Management Network](#mgmt_nw)
    2. [Custom NAT Network](#nat_nw)
    3. [Isolated Network](#iso_nw) 
3. [Virtual Manchines](#vms)
    2. [Create VM Shell Script](#cv_install)

## Prerequisites <a name = "prereq"></a>

### Required Packages
1. bridge-utils
2. libvirt-clients
3. libvirt-daemon
4. qemu
5. qemu-kvm
6. libvirt-dev
7. libvirt-daemon-system
8. libguestfs-tools
9. virt-manager
10. libosinfo-bin
11. iptables-persistent
12. python3-dev
13. python3-pip

### Add user to appropriate groups
```
sudo usermod -a -G libvirt $USER
sudo usermod -a -G libvirt-qemu $USER
```

## Network <a name = "network_types"></a>
1. Management network
2. Custom NAT network
3. Isolated network

Libvirt implicitly installs a default NAT network. However libvirt's NAT network automatically inserts iptables rules whether you want them or not — in an order that is difficult to control — unless you disable the default network completely

Disbale libvirt's default network. We will create a Custom NAT Network.
```
virsh net-destroy default
virsh net-autostart --disable default
```

### Management Network <a name = "mgmt_nw"></a>
This is a host only network used for SSH connections. This is a libvirt managed network. During creation of VM, one of the network should be connected to virtual bridge for the management network. Use the helper script `setup_management_network.sh` to create a Management network.

```
Usage: 
	bash setup_management_network.sh <bridge_name> <bridge_addr> <bridge_netmask> <dhcp_start> <dhcp_end>
		bridge_name : string
		bridge_addr : X.X.X.X
		bridge_netmask : X.X.X.X
		dhcp_start : X.X.X.X
		dhcp_end : X.X.X.X
```
Example :
```
bash setup_management_network.sh br-mgmt1 10.25.1.1 255.255.255.0 10.25.1.2 10.25.1.254
```

Verify the network is created. If you see a default network, follow steps mentioned above to disable it.
```
$ virsh net-list
 Name       State    Autostart   Persistent
---------------------------------------------
 br-mgmt1   active   yes         yes
```

### Custom NAT Network <a name = "nat_nw"></a>
To overcome the challenges of libvirt's NAT network, we will create a Custom NAT network using four main components: a dummy network interface, a virtual bridge, some iptables rules, and dnsmasq.

Use the `create_nat_network.sh` script to create custom networks. 

```
Usage: 
	bash setup_nat_network.sh <bridge_name> <bridge_subnet> <bridge_addr> <dhcp_start> <dhcp_end> <broadcast>
		bridge_name : string
		bridge_subnet : X.X.X.X/mask
		bridge_addr : X.X.X.X
		dhcp_start : X.X.X.X
		dhcp_end : X.X.X.X
		broadcast : X.X.X.255
```

Example :
```
bash setup_topology_bridge.sh br1 10.10.1.0/24 10.10.1.1 10.10.1.2 10.10.1.254 10.10.1.255
```
Repeat the same command with different subnet and bridge to get a new network.

Verify the network
```
$ ip link show | grep br1
14: br1-nic: <BROADCAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc noqueue master br1 state UNKNOWN mode DEFAULT group default qlen 1000
15: br1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default qlen 1000

$ sudo systemctl status dnsmasq@br1         
* dnsmasq@br1.service - DHCP and DNS caching server for br1.
     Loaded: loaded (/etc/systemd/system/dnsmasq@.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2023-04-18 10:32:30 PDT; 2 weeks 3 days ago
   Main PID: 658406 (dnsmasq)
      Tasks: 1 (limit: 621975)
     Memory: 10.7M
     CGroup: /system.slice/system-dnsmasq.slice/dnsmasq@br1.service
             `-658406 /usr/sbin/dnsmasq -k --conf-file=/var/lib/dnsmasq/br1/dnsmasq.conf
             
$ sudo cat /etc/iptables/rules.v4
```

### Isolated Network <a name = "iso_nw"></a>
Isolated Network are completely private to guest systems. All the guests on same isolated network will be able to communicate to each other

Use the `setup_isolated_network.sh` script to create isolated network for guest systems.

```
Usage: 
	bash setup_isolated_network.sh <bridge_name>
		bridge_name : string
```

Example:
```
bash setup_isolated_network.sh br-iso1
```

Verify the network is created.
```
$ virsh net-list
 Name       State    Autostart   Persistent
---------------------------------------------
 br-iso1    active   yes         yes
 br-mgmt1   active   yes         yes
```


## Virtual Machines <a name = "vms"></a>
For our topology we will create virtual machines using libvirt. Currently, manual intervention is required to install guest os on the virtual machines. However this can be avoided by creating a pre cooked template VM and using that to clone different VMs.



### Create VM Shell script <a name = "cv_install"></a>
Presently the `create_vm.sh` script supports two types of VM. PE (provider edge) and CE (customer edge). 

#### PE Virtual Machine
1. Memory : 16G
2. vCPUs : 8
3. Disk : 80G
4. 5 network interfaces
    1. 1 Management network
    2. 2 NAT Network
    3. 2 Isolated Network
5. Display : VNC

#### CE Virtual Machine
1. Memory : 8G
2. vCPUs : 4
3. Disk : 40G
4. 4 network interfaces
    1. 1 Management network
    2. 1 NAT Network (Only used if required to install packages and basic bring up)
    3. 2 Isolated Network
5. Display : VNC

```
Usage
	bash create_vm.sh <vm-type> <vm-name> <vnc-port>

	   1. vm-type : <pe | ce> (pe = provider edge, ce = customer edge)
	   2. vm-name : <name>
	   4. vnc-port : <port> (port >= 5900)
```

Example for PE:
```
bash create_vm.sh pe pe1 5901
```

Example for CE
```
bash create_vm.sh ce ce11 5911
```
