import utils
from networks import VmNetwork
from deploy_topology import VmDisk, VmGraphics


class VirtualMachine:
    def __init__(self, vmType, name, vcpus, ram,
                 os, networks, iMedia, graphics, disk):
        self.vmType = vmType
        self.name = name
        self.vcpus = vcpus
        self.ram = ram
        self.os = os
        self.networks = networks
        self.install_media = iMedia
        self.graphics = graphics
        self.disk = disk

    def Create(self):
        pass

    def Destroy(self):
        pass

    def Provision(self):
        pass

    def Update(self):
        pass

def ParseVmsConfig(vmsConf):
    vms = []
    for vmConf in vmsConf:
        networks = []
        for nwConf in vmConf["networks"]:
            nw = VmNetwork(nwConf["bridge"], nwConf["model"], nwConf["ip4_addr"],
                           utils.GenerateVirtioMac())
            networks.append(nw)

        graphicsConf = vmConf["graphics"]
        graphics = VmGraphics(graphicsConf["type"], graphicsConf["listen"],
                              graphicsConf["port"])

        disk = VmDisk(vmConf["disk_sz"])

        vm = VirtualMachine("pe", vmConf["name"], vmConf["vcpus"],
                            vmConf["ram"], vmConf["os"], networks, None,
                            graphics, disk)
        vms.append(vm)

    return vms
