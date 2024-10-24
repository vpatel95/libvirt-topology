#!/bin/bash

set -e

function usage() {
    echo "Usage: "
    echo -e "\tbash ${0} <bridge_name>"
    echo ""
    echo -e "\t\tbridge_name : string"
}

if [[ "$#" -ne 1 ]]; then
    usage
    exit 1
fi

# Read from config
BR_NAME=${1}

if [[ -f "/etc/libvirt/qemu/networks/${BR_NAME}.xml" ]]; then
    echo "File found /etc/libvirt/qemu/networks/${BR_NAME}.xml"
    exit
fi

if [[ ! -f "/etc/libvirt/qemu/networks/${BR_NAME}.xml" ]]; then
sudo tee -a /etc/libvirt/qemu/networks/${BR_NAME}.xml > /dev/null << EOF
<network>
    <name>${BR_NAME}</name>
    <bridge name='${BR_NAME}' stp='on' delay='0' />
</network>
EOF

    sudo virsh net-define /etc/libvirt/qemu/networks/${BR_NAME}.xml
    sudo virsh net-start ${BR_NAME}
    sudo virsh net-autostart ${BR_NAME}
fi

set +e
