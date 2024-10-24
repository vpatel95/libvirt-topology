import utils
import virtual_machines
import bridges

class VmInstallMedia:
    def __init__(self, mType, path):
        self.mType = mType
        self.path = path

class VmGraphics:
    def __init__(self, gType, listen, port):
        self.gType = gType
        self.listen = listen
        self.port = port

class VmDisk:
    def __init__(self, size):
        self.path = "/var/lib/libvirt/images/"
        self.format = "qcow2"
        self.size = size
        self.bus = "virtio"

class Topology:
    def __init__(self, topologyConf):
        self.config = topologyConf
        self.vms = self.GetVirtualMachines()
        self.host_bridges = self.GetBridges()

    def GetVirtualMachines(self):
        vmsConf = self.config.get("vms", None)
        if vmsConf is not None:
            return virtual_machines.ParseVmsConfig(vmsConf)
        else:
            print("No VM Config")
            return None

    def GetBridges(self):
        hostBridgesConf = self.config.get("host_bridges", None)
        if hostBridgesConf is not None:
            return bridges.ParseHostBridgesConfing(hostBridgesConf, self.vms)
        else:
            print("No Host Bridge Config")
            return None

if __name__ == '__main__':
    topologyConf = utils.ParseTopology()
    topology = Topology(topologyConf)
