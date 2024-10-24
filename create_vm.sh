#!/bin/bash

# Read from config (json)
CE_SIZE="40"
PE_SIZE="80"

function usage() {
    echo "Usage"
    echo -e "\tbash $0 <vm-type> <vm-name> <mac-addr-mgmt> <vnc-port>"
    echo ""
    echo -e "\t   1. vm-type : <pe | ce> (pe = provider edge, ce = customer edge)"
    echo -e "\t   2. vm-name : <name>"
    echo -e "\t   3. mac-addr-mgmt : 52:54:00:xx:xx:xx"
    echo -e "\t   4. vnc-port : <port> (port >= 5900)"
}

function create_pe() {
    VM_NAME=${1}
    MAC_ADDR=${2}
    VNC_PORT=${3}
    sudo virt-install \
        --virt-type kvm \
        --name ${VM_NAME} \
        --vcpus 8 \
        --ram 16384 \
        --os-variant ubuntu20.04 \
        --graphics vnc,listen=0.0.0.0,port=${VNC_PORT} \
        --cdrom /var/lib/libvirt/boot/ubuntu-22.04.2-live-server-amd64.iso \
        --disk path=/var/lib/libvirt/images/${VM_NAME}.qcow2,size=80,bus=virtio,format=qcow2 \
        --network bridge=br-mgmt1,model=virtio,mac=${MAC_ADDR} \
        --network bridge=br1,model=virtio \
        --network bridge=br2,model=virtio \
        --network bridge=br-iso1,model=virtio \
        --network bridge=br-iso2,model=virtio \
        --noautoconsole
}

function create_ce() {
    VM_NAME=${1}
    MAC_ADDR=${2}
    VNC_PORT=${3}
    sudo virt-install \
        --virt-type kvm \
        --name ${VM_NAME} \
        --vcpus 8 \
        --ram 8192 \
        --os-variant ubuntu20.04 \
        --graphics vnc,listen=0.0.0.0,port=${VNC_PORT} \
        --cdrom /var/lib/libvirt/boot/ubuntu-22.04.2-live-server-amd64.iso \
        --disk path=/var/lib/libvirt/images/${VM_NAME}.qcow2,size=40,bus=virtio,format=qcow2 \
        --network bridge=br-mgmt1,model=virtio,mac=${MAC_ADDR} \
        --network bridge=br-iso1,model=virtio \
        --network bridge=br-iso2,model=virtio \
        --network bridge=br1,model=virtio \
        --noautoconsole
}

function create_dev() {
    VM_NAME=${1}
    MAC_ADDR=${2}
    VNC_PORT=${3}
    sudo virt-install \
        --virt-type kvm \
        --name ${VM_NAME} \
        --vcpus 32 \
        --ram 65536 \
        --os-variant ubuntu20.04 \
        --graphics vnc,listen=0.0.0.0,port=${VNC_PORT} \
        --cdrom /var/lib/libvirt/boot/ubuntu-22.04.2-live-server-amd64.iso \
        --disk path=/var/lib/libvirt/images/${VM_NAME}.qcow2,size=300,bus=virtio,format=qcow2 \
        --network bridge=br-mgmt1,model=virtio,mac=${MAC_ADDR} \
        --network bridge=br1,model=virtio \
        --network bridge=br2,model=virtio \
        --noautoconsole
}

function delete_vm() {
    VM_NAME=${1}
    virsh destroy ${VM_NAME}
    virsh undefine ${VM_NAME} --remove-all-storage
}

if [[ "$#" -ne 4 ]]; then
    usage
    exit
fi

case $1 in
    pe)
        shift
        create_pe ${1} ${2} ${3}
        ;;
    ce)
        shift
        create_ce ${1} ${2} ${3}
        ;;
    dev)
        shift
        create_dev ${1} ${2} ${3}
        ;;
    *)
        usage
        ;;
esac
