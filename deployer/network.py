import ipaddress
import logging
import psutil
import sys
from xml.dom import minidom
import xml.etree.cElementTree as ET

import deployer.globals as G
from deployer.globals import LIBVIRT_QEMU_NW, NETWORK_TYPES, OP_CREATE
from deployer.nat_utils import AddIptableRules, AddLinuxBridge, \
        CheckForwarding, DelIptableRules, DelLinuxBridge
from deployer.topology import Topology
from deployer.utils import ExecuteCommand

class Network:
    type_ = None
    name_ = ""
    ip4_ = None
    network4_ = None
    network6_ = None
    ip6_ = None
    plen4_ = 24
    plen6_ = 120
    topology_ = Topology()

    def __init__(self, conf):
        Network.__validate_network_conf(conf)

        self.type_ = conf["type"]
        self.name_ = conf["name"]
        if self.type_ in ["nat", "management"]:
            self.__add_v4_network(conf["subnet4"])
            self.__add_v6_network(conf.get("subnet6", None))
    #end __init__

    @staticmethod
    def __has_valid_network_fields(nw):
        if nw.get("type", None) not in NETWORK_TYPES:
            logging.critical("Invalid network type in network config")
            sys.exit(3)

        if nw.get("name", None) is None:
            logging.critical("'name' is required key in network config")
            sys.exit(3)

        if nw["type"] == "isolated":
            return

        if nw.get("subnet4", None) is None:
            logging.critical("'subnet' is required key for nat and management"
                             " networks")
            sys.exit(3)
    #end __has_valid_network_fields

    @staticmethod
    def __validate_network_conf(nw):
        Network.__has_valid_network_fields(nw)

        if G.OP != OP_CREATE:
            return

        name = nw["name"]
        ntype = nw["type"]

        if len(name) > 12:
            logging.error(f"Max length for name is 12 characters : {name}")
            sys.exit(3)

        interfaces = psutil.net_if_addrs()

        if name in interfaces:
            logging.error(f"Network with name {name} is already present")
            sys.exit(3)

        if ntype == "isolated":
            return

        try:
            subnet4 = ipaddress.ip_network(nw["subnet4"],
                                        strict=False)
            subnet6 = None
            if nw.get("subnet6", None) is not None:
                subnet6 = ipaddress.ip_network(nw["subnet6"],
                                            strict=False)
        except ValueError:
            logging.error("Invalid Subnet(s). Please check again")
            sys.exit(3)

        for interface, addrs in psutil.net_if_addrs().items():
            for addr in addrs:
                if addr.family == 2:
                    if ipaddress.IPv4Address(addr.address) in subnet4:
                        logging.error(f"Network colliding with {str(subnet4)} "
                                        f" already exists on {interface}")
                        sys.exit(3)

                if (addr.family == 10 and subnet6 is not None):
                    v6_addr = addr.address.split('%')[0]
                    if ipaddress.IPv6Address(v6_addr) in subnet6:
                        logging.error(f"Network colliding with {str(subnet6)} "
                                        f" already exists on {interface}")
                        sys.exit(3)

        for _, network in Network.Topology().Networks():
            if subnet4 == network.network4_:
                logging.error(f"IPv4 Network {name} is colliding with " \
                        f"{network.name_}")
                sys.exit(3)

            if subnet6 is not None:
                if subnet6 == network.network6_:
                    logging.error(f"IPv6 Network {name} is colliding with " \
                            f"{network.name_}")
                    sys.exit(3)

        return
    #end __validate_network_conf

    @staticmethod
    def Topology():
        return Network.topology_
    #end Topology

    def __add_v4_network(self, subnet4):
        logging.debug(f"Adding IPv4 Network for {self.name_}")
        self.network4_ = ipaddress.IPv4Network(subnet4)
        self.ip4_ = self.network4_[1]
    #end __add_v4_network

    def __add_v6_network(self, subnet6):
        if subnet6 is not None:
            logging.debug(f"Adding IPv6 Network for {self.name_}")
            self.network6_ = ipaddress.IPv6Network(subnet6)
            self.ip6_ = self.network6_[1]
        else:
            logging.warning(f"No IPv6 subnet provided for {self.name_}")
    #end __add_v6_network

    def __create_nat_network(self):
        logging.info(f"Creating NAT network : {self.name_}")

        if self.network4_:
            self.plen4_ = self.network4_.prefixlen
        if self.network6_:
            self.plen6_ = self.network6_.prefixlen

        CheckForwarding()

        AddLinuxBridge(self.name_, str(self.ip4_), str(self.ip6_),
                       self.plen4_, self.plen6_)
        AddIptableRules(self.name_, str(self.network4_))
    #end __create_nat_network

    def __create_management_network(self):
        logging.info(f"Creating Management network : {self.name_}")
        nw_cfg_file = LIBVIRT_QEMU_NW.joinpath(f"{self.name_}.xml")

        nw_ele = ET.Element("network")
        ET.SubElement(nw_ele, "name").text = self.name_
        ET.SubElement(nw_ele, "bridge", {"name": self.name_, "stp": "on", "delay": "0"})

        if self.network4_:
            ip_ele = ET.SubElement(nw_ele, "ip", {
                "address": str(self.ip4_),
                "netmask": str(self.network4_.netmask)
            })

        xmlstr = minidom.parseString(ET.tostring(nw_ele)).toprettyxml(indent="   ")
        with open (nw_cfg_file, "w") as f:
            f.write(xmlstr)

        cmd = f"sudo virsh net-define {nw_cfg_file}"
        ExecuteCommand(cmd)
        cmd = f"sudo virsh net-start {self.name_}"
        ExecuteCommand(cmd)
        cmd = f"sudo virsh net-autostart {self.name_}"
        ExecuteCommand(cmd)
    #end __create_management_network


    def __create_isolated_network(self):
        logging.info(f"Creating Isolated network : {self.name_}")
        nw_cfg_file = LIBVIRT_QEMU_NW.joinpath(f"{self.name_}.xml")

        nw_ele = ET.Element("network")
        ET.SubElement(nw_ele, "name").text = self.name_
        ET.SubElement(nw_ele, "bridge", {"name": self.name_, "stp": "on", "delay": "0"})

        xmlstr = minidom.parseString(ET.tostring(nw_ele)).toprettyxml(indent="   ")
        with open (nw_cfg_file, "w") as f:
            f.write(xmlstr)

        cmd = f"sudo virsh net-define {nw_cfg_file}"
        ExecuteCommand(cmd)
        cmd = f"sudo virsh net-start {self.name_}"
        ExecuteCommand(cmd)
        cmd = f"sudo virsh net-autostart {self.name_}"
        ExecuteCommand(cmd)
    #end __create_isolated_network

    def __delete_nat_network(self):
        DelIptableRules(self.name_, str(self.network4_))
        DelLinuxBridge(self.name_)
    #end __delete_nat_network

    def __delete_libvirt_network(self):
        cmd = f"sudo virsh net-destroy {self.name_}"
        ExecuteCommand(cmd)
        cmd = f"sudo virsh net-undefine {self.name_}"
        ExecuteCommand(cmd)
    #end __delete_libvirt_network

    def Delete(self):
        if self.type_ == "nat":
            self.__delete_nat_network()
        elif self.type_ in ["isolated","management"]:
            self.__delete_libvirt_network()
        else:
            logging.error(f"Unknown network type {self.type_}")
            sys.exit(3)
    #end Delete


    def Create(self):
        if self.type_ == "nat":
            self.__create_nat_network()
        elif self.type_ == "isolated":
            self.__create_isolated_network()
        elif self.type_ == "management":
            self.__create_management_network()
        else:
            logging.error(f"Unknown network type {self.type_}")
            sys.exit(3)
    #end Create

    def Type(self):
        return self.type_
    #end Type

    def IsIsolated(self):
        return self.type_ == "isolated"
    #end IsIsolated

    def IsManagement(self):
        return self.type_ == "management"
    #end IsManagement

    def IsNat(self):
        return self.type_ == "nat"
    #end IsNat

    def __str__(self):
        nw_str = f"Type : {self.type_}\n"
        nw_str += f"Bridge : {self.name_}\n"
        if self.type_ in ["nat", "management"]:
            if self.network4_ is not None:
                nw_str += "--- IPv4 Network ---\n"
                nw_str += f"Network : {self.network4_}\n"
                nw_str += f"Address : {self.ip4_}\n"
            if self.network6_ is not None:
                nw_str += "--- IPv6 Network ---\n"
                nw_str += f"Network : {self.network6_}\n"
                nw_str += f"Address : {self.ip6_}\n"
        nw_str += "===================================\n"
        return nw_str
