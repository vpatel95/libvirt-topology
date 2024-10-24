from networks import Dhcp, StaticHost
import utils

class BridgeParams:
    def __init__(self, stp):
        self.stp = stp

class Bridge:
    def __init__(self, name, ip4_addr, ip4_subnet, dhcp, parameters):
        self.name = name
        self.ip4_addr = ip4_addr
        self.ip4_subnet = ip4_subnet
        self.dhcp = dhcp
        self.dummy_intf = name + "-dummy"
        self.dummy_intf_mac = utils.GenerateVirtioMac()
        self.parameters = parameters

    def Create(self):
        pass

    def ReadConfig(self):
        pass

    def SetupIptables(self):
        pass

    def SetupDnsmasq(self):
        pass

def ParseHostBridgesConfing(bridgesConf, vms):
    bridges = []
    for bridgeConf in bridgesConf:
        hosts = []
        for vm in vms:
            for network in vm.networks:
                if network.bridge == bridgeConf["name"]:
                    host = StaticHost(vm.name, network.mac, network.ip4_addr)
                    hosts.append(host)

        dhcpConf = bridgeConf["dhcp4"]
        dhcp = Dhcp(dhcpConf["start"], dhcpConf["end"], hosts)

        params = BridgeParams(bridgeConf["parameters"]["stp"])

        bridge = Bridge(bridgeConf["name"], bridgeConf["ip4_addr"],
                        bridgeConf["ip4_subnet"], dhcp, params)

        bridges.append(bridge)

    return bridges
