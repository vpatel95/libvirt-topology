import json
import logging
import sys

import deployer.globals as G
from deployer.network import Network
from deployer.topology import Topology
from deployer.utils import ProcessArguments
from deployer.virtual_machine import VirtualMachine

class Deployer:
    config_ = {}
    topology_ = Topology()

    def __init__(self, config:str):
        with open(config) as conf_file:
            self.config_ = json.load(conf_file)

        Deployer.__validate_version(self.config_)

        self.__parse_networks()
        self.__parse_vms()
    #end __init__

    @staticmethod
    def __validate_version(config:dict):
        if config is None:
            logging.critical(f"Error parsing config file {config}")
            sys.exit(1)

        if config.get("version", None) is None:
            logging.error("This looks like older version of config which is "
                          " supported only by 0.0.x version")
            sys.exit(1)

        if config["version"] != 2:
            logging.error("This version supports only version 2 of config")
            sys.exit(1)
    #end __validate_version

    def __parse_networks(self):
        nw_configs = self.config_.get("networks", None)

        if nw_configs is None:
            logging.critical("No network config found. Exiting")
            sys.exit(1)

        if not isinstance(nw_configs, list):
            logging.critical("'network' config should be a list")
            sys.exit(1)

        for nw_conf in nw_configs:
            name = nw_conf["name"]
            nw = Network(nw_conf)
            self.Topology().AddNetwork(name, nw)
    #end __parse_networks

    def __parse_vms(self):
        vm_configs = self.config_.get("vms", None)

        if vm_configs is None:
            logging.critical("No VMs config found. Exiting")
            sys.exit(1)

        if not isinstance(vm_configs, list):
            logging.critical("'vms' config should be a list")
            sys.exit(1)

        for vm_conf in vm_configs:
            name = vm_conf["name"]
            vm = VirtualMachine(vm_conf)
            self.Topology().AddVm(name, vm)
    #end __parse_vms

    def Topology(self):
        return self.topology_
    #end Topology

#end Deployer

def topology_deployer():
    conf_file = ProcessArguments(sys.argv[1:])
    tDeployer = Deployer(conf_file)
    topology = tDeployer.Topology()

    if G.OP == G.OP_CREATE:
        topology.Create()
    elif G.OP == G.OP_DELETE:
        topology.Delete()
    else:
        logging.critical(f"Invalid operation {G.OP}")
        sys.exit(1)
