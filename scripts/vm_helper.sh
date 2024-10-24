#!/bin/bash

# Read from config (json)
CE_SIZE="40"
PE_SIZE="80"

function invalid_usage() {
    echo "Invalid arguments"
    echo -e "\tbash $0 <operation> <vm-name> [<vm-type> <vnc-port>]"
    echo ""
    echo -e "\t   Options:"
    echo -e "\t   bash $0 add <vm-name> <vm-type> <vnc-port>"
    echo -e "\t   bash $0 del <vm-name>"
    echo -e "\t   1. operation : <add | del>"
    echo -e "\t   2. vm-name : <name>"
    echo -e "\t   3. vm-type : <pe | ce>"
    echo -e "\t   4. vnc-port : <port> (port >= 5900)"
}

function add_usage() {
    echo "Invalid arguments"
    echo -e "\tbash $0 add <vm-name> <vm-type> <vnc-port>"
    echo ""
    echo -e "\t   Options:"
    echo -e "\t     vm-name : <name>"
    echo -e "\t     vm-type : <pe | ce>"
    echo -e "\t     vnc-port : <port> (port >= 5900)"
}

function del_usage() {
    echo "Invalid arguments"
    echo -e "\tbash $0 del <vm-name>"
    echo ""
    echo -e "\t   Options:"
    echo -e "\t     vm-name : <name>"
}

function create_pe() {
    VM_NAME=${1}
    VNC_PORT=${2}

    sudo mkdir -p /var/lib/libvirt/images/${VM_NAME}
    sudo qemu-img convert -f qcow2 -O qcow2 \
        /var/lib/libvirt/images/templates/ubuntu-22.04-server.qcow2 \
        /var/lib/libvirt/images/$VM_NAME/root-disk.qcow2
    sudo qemu-img resize /var/lib/libvirt/images/$VM_NAME/root-disk.qcow2 80G

    sudo virt-install \
        --virt-type kvm \
        --name ${VM_NAME} \
        --vcpus 8 \
        --ram 16384 \
        --os-variant ubuntu20.04 \
        --graphics vnc,listen=0.0.0.0,port=${VNC_PORT} \
        --disk path=/var/lib/libvirt/images/${VM_NAME}/root-disk.qcow2,bus=virtio,format=qcow2 \
        --network bridge=br-mgmt1,model=virtio \
        --network bridge=br1,model=virtio \
        --network bridge=br2,model=virtio \
        --network bridge=br-iso1,model=virtio \
        --network bridge=br-iso2,model=virtio \
        --noautoconsole \
        --import
}

function create_ce() {
    VM_NAME=${1}
    VNC_PORT=${2}

    sudo mkdir -p /var/lib/libvirt/images/${VM_NAME}
    sudo qemu-img convert -f qcow2 -O qcow2 \
        /var/lib/libvirt/images/templates/ubuntu-22.04-server.qcow2 \
        /var/lib/libvirt/images/$VM_NAME/root-disk.qcow2
    sudo qemu-img resize /var/lib/libvirt/images/$VM_NAME/root-disk.qcow2 40G

    sudo virt-install \
        --virt-type kvm \
        --name ${VM_NAME} \
        --vcpus 8 \
        --ram 8192 \
        --os-variant ubuntu20.04 \
        --graphics vnc,listen=0.0.0.0,port=${VNC_PORT} \
        --disk path=/var/lib/libvirt/images/${VM_NAME}/root-disk.qcow2,bus=virtio,format=qcow2 \
        --network bridge=br-mgmt1,model=virtio \
        --network bridge=br-iso1,model=virtio \
        --network bridge=br-iso2,model=virtio \
        --network bridge=br1,model=virtio \
        --noautoconsole \
        --import
}

function create_dev() {
    VM_NAME=${1}
    VNC_PORT=${2}

    sudo mkdir -p /var/lib/libvirt/images/${VM_NAME}
    sudo qemu-img convert -f qcow2 -O qcow2 \
        /var/lib/libvirt/images/templates/ubuntu-22.04-server.qcow2 \
        /var/lib/libvirt/images/$VM_NAME/root-disk.qcow2
    sudo qemu-img resize /var/lib/libvirt/images/$VM_NAME/root-disk.qcow2 40G

    sudo virt-install \
        --virt-type kvm \
        --name ${VM_NAME} \
        --vcpus 32 \
        --ram 65536 \
        --os-variant ubuntu20.04 \
        --graphics vnc,listen=0.0.0.0,port=${VNC_PORT} \
        --disk path=/var/lib/libvirt/images/${VM_NAME}/root-disk.qcow2,bus=virtio,format=qcow2 \
        --network bridge=br-mgmt1,model=virtio \
        --network bridge=br1,model=virtio \
        --network bridge=br2,model=virtio \
        --noautoconsole \
        --import
}

function delete_vm() {
    VM_NAME=${1}
    virsh destroy ${VM_NAME}
    virsh undefine ${VM_NAME} --remove-all-storage
}

if [[ "$#" -le 1 ]]; then
    invalid_usage
    exit
fi

OPER=$1

case $OPER in
    add)
        if [[ "$#" -ne 4 ]]; then
            echo "$# $@"
            add_usage
            exit 1
        fi
        shift
        case $2 in
            pe)
                create_pe ${1} ${3}
                ;;
            ce)
                create_ce ${1} ${3}
                ;;
            dev)
                create_dev ${1} ${3}
                ;;
            *)
                usage
                ;;
        esac
        ;;
    del)
        if [[ "$#" -ne 2 ]]; then
            del_usage
            exit 1
        fi
        shift
        delete_vm ${1}
        ;;
    *)
        invalid_usage
        ;;
esac
