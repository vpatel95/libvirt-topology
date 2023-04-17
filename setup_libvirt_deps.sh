#!/bin/bash

sudo apt-get update

# Required packages for kvm
sudo apt-get install -y \
    bridge-utils \
    cpu-checker \
    libvirt-clients \
    libvirt-daemon \
    qemu \
    qemu-kvm \
    libvirt-dev \
    libvirt-daemon-system \
    libguestfs-tools \
    virt-manager \
    libosinfo-bin \
    iptables-persistent

pip3 install libvirt-python

sudo usermod -a -G libvirt $USER
sudo usermod -a -G libvirt-qemu $USER
