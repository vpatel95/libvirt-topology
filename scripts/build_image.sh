#!/bin/bash

SOURCE_IMG=jammy-server-cloudimg-amd64.img
JCNR_TEMPLATE=jcnr-template.qcow2
JCNR_TEMPLATE_COMP=jcnr-template-comp.qcow2
TEMPLATE_SZ=5.5G
DIR=`pwd`

sudo rm ${SOURCE_IMG}
sudo rm ${JCNR_TEMPLATE}
sudo rm ${JCNR_TEMPLATE_COMP}

wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img

sudo qemu-img create -f qcow2 -o preallocation=metadata ${JCNR_TEMPLATE} ${TEMPLATE_SZ}
sudo virt-resize --expand /dev/sda1 ${SOURCE_IMG} ${JCNR_TEMPLATE}

sudo virt-customize -a ${JCNR_TEMPLATE} --run-command 'grub-install /dev/sda'
sudo virt-customize -a ${JCNR_TEMPLATE} --root-password password:c0ntrail123
sudo virt-customize -a ${JCNR_TEMPLATE} --run ${DIR}/setup_template.sh -v
sudo virt-customize -a ${JCNR_TEMPLATE} --copy-in ${DIR}/calico.yaml:/home
sudo virt-customize -a ${JCNR_TEMPLATE} --copy-in ${DIR}/multus.yaml:/home
sudo virt-customize -a ${JCNR_TEMPLATE} --copy-in ${DIR}/jcnr-secrets.yaml:/home
sudo virt-customize -a ${JCNR_TEMPLATE} --copy-in ${DIR}/dpdk-devbind.py:/home

sudo qemu-img convert -c -f qcow2 -O qcow2 ${JCNR_TEMPLATE} ${JCNR_TEMPLATE_COMP}
