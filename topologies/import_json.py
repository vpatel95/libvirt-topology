import json
from xml.etree.ElementTree import Element, SubElement, tostring


def convert_to_xml(data):
    root = Element('mxfile', {
        'host': 'Electron',
        'modified': '2024-04-21T18:52:52.466Z',
        'agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/22.1.16 Chrome/120.0.6099.109 Electron/28.1.0 Safari/537.36',
        'etag': 'Jn3_KNP23sdxdWY-BK48',
        'version': '22.1.16',
        'type': 'device'
    })

    diagram = SubElement(root, 'diagram', {'id': 'tXaP7wr8Wuc8PtstvcKB', 'name': 'Network Topology'})
    graph_model = SubElement(diagram, 'mxGraphModel', {
        'dx': '1242', 'dy': '796', 'grid': '1', 'gridSize': '10', 'guides': '1', 'tooltips': '1',
        'connect': '1', 'arrows': '1', 'fold': '1', 'page': '1', 'pageScale': '1', 'pageWidth': '1100',
        'pageHeight': '850', 'math': '0', 'shadow': '0'
    })

    # Add networks
    networks = data.get('networks', [])
    for network in networks:
        network_cell = SubElement(graph_model, 'mxCell', {
            'id': network['name'],
            'parent': '1',
            'vertex': '1'
        })
        network_data = SubElement(network_cell, 'mxGeometry', {
            'x': '280',
            'y': '160',
            'width': '120',
            'height': '40'
        })
        network_data.text = network['name']

    # Add VMs
    vms = data.get('vms', [])
    for vm in vms:
        vm_cell = SubElement(graph_model, 'mxCell', {
            'id': vm['name'],
            'parent': '1',
            'vertex': '1'
        })
        vm_data = SubElement(vm_cell, 'mxGeometry', {
            'x': '680',
            'y': '160',
            'width': '120',
            'height': '40'
        })
        vm_data.text = vm['name']

        # Add edges between VMs and networks
        for network_name, network_info in vm.get('networks', {}).items():
            edge_cell = SubElement(graph_model, 'mxCell', {
                'id': f"{vm['name']}-{network_name}",
                'parent': '1',
                'edge': '1',
                'source': vm['name'],
                'target': network_name
            })

    return tostring(root, encoding='utf-8').decode()


# Example JSON data representing network topology
json_data = """
{
    "version": 2,
    "networks": [
        {"name": "mgmt1", "type": "management", "subnet4": "10.25.1.0/24"},
        {"name": "mgmt2", "type": "nat", "subnet4": "10.25.2.0/24"}
    ],
    "vms": [
        {
            "name": "master",
            "flavor": "pe",
            "vnc_port": 5950,
            "networks": {
                "mgmt1": {"v4": "10.25.1.10"}
            }
        },
        {
            "name": "kubelet1",
            "flavor": "pe",
            "vnc_port": 5960,
            "networks": {
                "mgmt1": {"v4": "10.25.1.20"}
            }
        }
    ]
}
"""

# Convert JSON to XML
xml_data = convert_to_xml(json.loads(json_data))
print(xml_data)
