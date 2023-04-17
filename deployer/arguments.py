import argparse
import json


def ParseTopology():
    parser = argparse.ArgumentParser(description='Parse topology config')
    parser.add_argument('-c', '--config', nargs='?', default='topology.json', required=True)
    args = parser.parse_args()

    with open(args.config) as confFile:
        return json.load(confFile)
