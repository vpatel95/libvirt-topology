import ipaddress
import logging
import sys

from .utils import ExecuteCommand

class Network:
    topology_ = None
    type_ = ""
    name_ = ""
    ip4_ = None
    broadcast4_ = None
    dhcp_start4_ = None
    dhcp_end4_ = None
    network4_ = None
    network6_ = None
    ip6_ = None
    broadcast6_ = None
    dhcp_start6_ = None
    dhcp_end6_ = None

    def __init__(self, nw_type: str, conf: dict, topo):
        self.topology_ = topo
        self.type_ = nw_type
        self.name_ = conf["name"]
        if self.type_ in ["nat", "management"]:
            self.__create_v4_network(conf.get("subnet4", None))
            self.__create_v6_network(conf.get("subnet6", None))
            logging.debug(self.ToString())

    def __create_v4_network(self, subnet4: str) -> None:
        if subnet4 is not None:
            logging.debug("Creating IPv4 Network for {}".format(self.name_))
            self.network4_ = ipaddress.IPv4Network(subnet4)
            self.ip4_ = self.network4_[1]
            self.broadcast4_ = self.network4_.broadcast_address
            self.dhcp_start4_ = self.network4_[2]
            self.dhcp_end4_ = self.network4_[-2]
        else:
            logging.critical("No IPv4 subnet provided for {}".format(self.name_))
            sys.exit(1)

    def __create_v6_network(self, subnet6: str) -> None:
        if subnet6 is not None:
            logging.debug("Creating IPv6 Network for {}".format(self.name_))
            self.network6_ = ipaddress.IPv6Network(subnet6)
            self.ip6_ = self.network6_[1]
            self.broadcast6_ = self.network6_.broadcast_address
            self.dhcp_start6_ = self.network6_[2]
            self.dhcp_end6_ = self.network6_[-2]
        else:
            logging.warning("No IPv6 subnet provided for {}".format(self.name_))

    def __create_nat_network(self) -> None:
        logging.info("Creating NAT network : {}".format(self.name_))
        cmd = "create_nat_network {} {} {} {} {} {}".format(
                self.name_, self.network4_,
                self.ip4_, self.dhcp_start4_,
                self.dhcp_end4_, self.broadcast4_)
        ExecuteCommand(cmd)


    def __create_management_network(self) -> None:
        logging.info("Creating Management network : {}".format(self.name_))
        if self.network4_ is not None:
            cmd = "create_management_network {} {} {} {} {}".format(
                    self.name_, self.ip4_,
                    self.network4_.netmask, self.dhcp_start4_,
                    self.dhcp_end4_)
            ExecuteCommand(cmd)

    def __create_isolated_network(self) -> None:
        logging.info("Creating Isolated network : {}".format(self.name_))
        cmd = "create_isolated_network {}".format(self.name_)
        ExecuteCommand(cmd)

    def Create(self):
        if self.type_ == "nat":
            self.__create_nat_network()
        elif self.type_ == "isolated":
            self.__create_isolated_network()
        elif self.type_ == "management":
            self.__create_management_network()
        else:
            logging.error("Unknown network type {}".format(self.type_))
            sys.exit(1)

    def ToString(self) -> str:
        nw_str = ""
        nw_str += "Type : {}\n".format(self.type_)
        nw_str += "Bridge : {}\n".format(self.name_)
        if self.type_ in ["nat", "management"]:
            if self.network4_ is not None:
                nw_str += "--- IPv4 Network ---\n"
                nw_str += "Network : {}\n".format(self.network4_)
                nw_str += "Address : {}\n".format(self.ip4_)
                nw_str += "DHCP Start : {}\n".format(self.dhcp_start4_)
                nw_str += "DHCP End : {}\n".format(self.dhcp_end4_)
                nw_str += "Broadcast : {}\n".format(self.broadcast4_)
            if self.network6_ is not None:
                nw_str += "--- IPv6 Network ---\n"
                nw_str += "Network : {}\n".format(self.network6_)
                nw_str += "Address : {}\n".format(self.ip6_)
                nw_str += "DHCP Start : {}\n".format(self.dhcp_start6_)
                nw_str += "DHCP End : {}\n".format(self.dhcp_end6_)
                nw_str += "Broadcast : {}\n".format(self.broadcast6_)
        nw_str += "===================================\n"
        return nw_str
