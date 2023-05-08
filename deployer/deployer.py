from topology import Topology
import utils

if __name__ == "__main__":

    conf_file = utils.ProcessArguments()
    topology = Topology()
    topology.Init(conf_file)
