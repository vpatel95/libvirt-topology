import json
import yaml
import subprocess
import argparse
import json


def ParseTopology():
    parser = argparse.ArgumentParser(description='Parse topology config')
    parser.add_argument('-c', '--config', nargs='?', default='topology.json', required=True)
    args = parser.parse_args()

    with open(args.config) as confFile:
        return json.load(confFile)

def ExecuteCommand(cmd):
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if process.stdout is not None:
        return process.stdout.read().decode().rstrip()
    return ""

def GenerateVirtioMac():
    mac_addr = ExecuteCommand([
        'hexdump', '-vn3', '-e', '/3 "52:54:00"',
        '-e', '/1 ":%02x"', '-e', '"\\n"', '/dev/urandom'
    ])
    return mac_addr

def ConvertJsonToYaml(jsonFile, yamlFile):
    with open(jsonFile, 'r') as jsonConfig:
        configuration = json.load(jsonConfig)

    with open(yamlFile, 'w') as yamlConfig:
        yaml.dump(configuration, yamlConfig)

def CheckIpv4Forwarding():
    val = ExecuteCommand(['cat', '/proc/sys/net/ipv4/ip_forward'])
    if val != "1":
        ExecuteCommand(['echo', '1 >> /proc/sys/net/ipv4/ip_forward'])

    val = ExecuteCommand(['cat', '/proc/sys/net/ipv4/ip_forward'])
    if val != "1":
        ExecuteCommand(['echo', '1 >> /proc/sys/net/ipv4/ip_forward'])
