class StaticHost:
    def __init__(self, name, mac, ip4_addr):
        self.mac = mac
        self.name = name
        self.ip4_addr = ip4_addr

class Dhcp:
    def __init__(self, start, end, hosts):
        self.start = start
        self.end = end
        self.host = hosts

class ManagementNetwork:
    def __init__(self, name, bridge_name, ip4_addr, ip4_netmask, dhcp):
        self.name = name
        self.bridge_name = bridge_name
        self.ip4_addr = ip4_addr
        self.ip4_netmask = ip4_netmask
        self.dhcp = dhcp

    def Define(self):
        pass

    def Start(self):
        pass

    def CreateConfig(self):
        pass

    def AutoStart(self, enable):
        pass

class VmNetwork:
    def __init__(self, bridge, model, ip4_addr, mac):
        self.bridge = bridge
        self.model = model
        self.ip4_addr = ip4_addr
        self.mac = mac

