import ipaddress
import logging
from socket import AddressFamily
import unittest
from unittest import mock

import deployer
import deployer.topology
import deployer.globals as G
from deployer.network import Network


class TestNetwork(unittest.TestCase):
    def setUp(self):
        G.OP = G.OP_CREATE
        self.nw_ = {"name": "test-nw"}
        self.iso_nw_ = {"name": "test-nw", "type": "isolated"}
        self.nat_nw_ = {"name": "test-nw", "type": "nat", "subnet4":
            "10.10.1.0/24", "subnet6": "1234::10.10.1.0/120"}
        self.mgmt_nw_ = {"name": "test-nw", "type": "management", "subnet4": "10.10.1.0/24"}
        logging.basicConfig(level="ERROR")

        # Mocking the psutil.net_if_addrs() method
        self.mocked_intf_ = [
            ('em1', AddressFamily.AF_INET, '20.20.1.1', '255.255.255.0', None, None),
            ('em1', AddressFamily.AF_INET6, '1234::1414:101',
                'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ff00', None, None),
            ('em1', AddressFamily.AF_PACKET, '52:54:00:aa:bb:cc', None, None, None)
        ]
        self.net_if_addr_patcher = mock.patch('psutil._psplatform.net_if_addrs')
        self.mock_net_if_addrs = self.net_if_addr_patcher.start()
        self.mock_net_if_addrs.return_value = self.mocked_intf_

        self.dummy_nw_ = Network({
            "name": "dummy-nw",
            "type": "nat",
            "subnet4": "11.11.11.0/24",
            "subnet6": "1234::11.11.11.0/120"
        })

        # Mocking the Topology.Networks() method
        self.mocked_topo_nw_ = {
            "dummy-nw": self.dummy_nw_
        }.items()
        self.topo_nw_patcher = mock.patch.object(deployer.topology.Topology, 'Networks')
        self.mock_topo_nw = self.topo_nw_patcher.start()
        self.mock_topo_nw.return_value = self.mocked_topo_nw_
    # end setUp

    def tearDown(self):
        self.net_if_addr_patcher.stop()
        self.topo_nw_patcher.stop()
    # end tearDown

    def test_network_field_type(self):
        # Test for empty type
        self.nw_["type"] = ""
        ok = Network._has_valid_network_fields(self.nw_)
        self.assertFalse(ok)

        # Test for invalid type
        self.nw_["type"] = "invalid"
        ok = Network._has_valid_network_fields(self.nw_)
        self.assertFalse(ok)

        self.nw_["type"] = 123
        ok = Network._has_valid_network_fields(self.nw_)
        self.assertFalse(ok)

        # Test for valid type
        ok = Network._has_valid_network_fields(self.iso_nw_)
        self.assertTrue(ok)
        ok = Network._has_valid_network_fields(self.mgmt_nw_)
        self.assertTrue(ok)
        ok = Network._has_valid_network_fields(self.nat_nw_)
        self.assertTrue(ok)

        # Test for missing type
        del self.nw_["type"]
        ok = Network._has_valid_network_fields(self.nw_)
        self.assertFalse(ok)
    # end test_network_field_type

    def test_network_field_name(self):
        # Test for valid name
        ok = Network._has_valid_network_fields(self.iso_nw_)
        self.assertTrue(ok)

        # Test for empty name
        self.iso_nw_["name"] = ""
        ok = Network._has_valid_network_fields(self.iso_nw_)
        self.assertFalse(ok)

        # Test for missing name
        del self.iso_nw_["name"]
        ok = Network._has_valid_network_fields(self.iso_nw_)
        self.assertFalse(ok)

        # Test for invalid name
        self.iso_nw_["name"] = 123
        ok = Network._has_valid_network_fields(self.iso_nw_)
        self.assertFalse(ok)
    # end test_network_field_name

    def test_network_field_subnet4(self):
        # Test for valid subnet4
        ok = Network._has_valid_network_fields(self.mgmt_nw_)
        self.assertTrue(ok)

        # Test for empty subnet4
        self.mgmt_nw_["subnet4"] = ""
        ok = Network._has_valid_network_fields(self.mgmt_nw_)
        self.assertFalse(ok)

        # Test for isolated network with subnet4
        self.iso_nw_["subnet4"] = ""
        ok = Network._has_valid_network_fields(self.iso_nw_)
        self.assertFalse(ok)

        # Test for isolated network with subnet6
        self.iso_nw_["subnet6"] = "1234::10.1.1.0/120"
        ok = Network._has_valid_network_fields(self.iso_nw_)
        self.assertFalse(ok)

        # Test for missing subnet4
        del self.mgmt_nw_["subnet4"]
        ok = Network._has_valid_network_fields(self.mgmt_nw_)
        self.assertFalse(ok)

        # Test for invalid subnet4
        self.mgmt_nw_["subnet4"] = 1234
        ok = Network._has_valid_network_fields(self.mgmt_nw_)
        self.assertFalse(ok)
    # end test_network_field_subnet4

    def test_network_field_subnet6(self):
        # Test for valid subnet6
        ok = Network._has_valid_network_fields(self.nat_nw_)
        self.assertTrue(ok)

        # Test for empty subnet6
        self.nat_nw_["subnet6"] = ""
        ok = Network._has_valid_network_fields(self.nat_nw_)
        self.assertFalse(ok)

        # Test for nat network with v4 only
        del self.nat_nw_["subnet6"]
        ok = Network._has_valid_network_fields(self.nat_nw_)
        self.assertTrue(ok)

        # Test for management network with subnet6
        self.mgmt_nw_["subnet6"] = "1234::10.10.1.0/120"
        ok = Network._has_valid_network_fields(self.mgmt_nw_)
        self.assertFalse(ok)

        # Test for invalid subnet6
        self.nat_nw_["subnet6"] = 1234
        ok = Network._has_valid_network_fields(self.nat_nw_)
        self.assertFalse(ok)
    # end test_network_field_subnet6

    def test_network_isolated_type(self):
        ok = Network._validate_network_conf(self.iso_nw_)
        self.assertTrue(ok)
    # end test_network_isolated_type

    def test_network_management_type(self):
        self.nw_["type"] = "management"

        # Test for subnet6
        self.nw_["subnet4"] = "10.10.1.0/24"
        self.nw_["subnet6"] = "1234::10.10.1.0/120"
        ok = Network._validate_network_conf(self.nw_)
        self.assertFalse(ok)
        del self.nw_["subnet6"]

        # Test for missing subnet4
        self.nw_["subnet4"] = ""
        ok = Network._validate_network_conf(self.nw_)
        self.assertFalse(ok)

        #Test for valid management network
        self.nw_["subnet4"] = "10.10.1.0/24"
        ok = Network._validate_network_conf(self.nw_)
        self.assertTrue(ok)
    # end test_network_management_type

    def test_network_nat_type(self):
        self.nw_["type"] = "nat"

        # Test for empty subnet4
        self.nw_["subnet4"] = ""
        ok = Network._validate_network_conf(self.nw_)
        self.assertFalse(ok)

        # Test for missing subnet4
        del self.nw_["subnet4"]
        ok = Network._validate_network_conf(self.nw_)
        self.assertFalse(ok)

        # Test for empty subnet6
        self.nw_["subnet4"] = "10.10.1.0/24"
        self.nw_["subnet6"] = ""
        ok = Network._validate_network_conf(self.nw_)
        self.assertFalse(ok)

        # Test for valid nat network with v4 only
        del self.nw_["subnet6"]
        self.nw_["subnet4"] = "10.10.1.0/24"
        ok = Network._validate_network_conf(self.nw_)
        self.assertTrue(ok)

        # Test for valid nat network with v4 and v6
        self.nw_["subnet6"] = "1234::10.10.1.0/120"
        ok = Network._validate_network_conf(self.nw_)
        self.assertTrue(ok)
    # end test_network_nat_type

    def test_network_required_subnet4(self):
        self.nw_["type"] = "nat"
        self.nw_["subnet6"] = "1234::10.10.1.0/24"

        ok = Network._has_valid_network_fields(self.nw_)
        self.assertFalse(ok)

        self.nw_["type"] = "management"
        ok = Network._has_valid_network_fields(self.nw_)
        self.assertFalse(ok)
    # end test_network_required_subnet4

    def test_validate_non_colliding_network_in_sys_v4(self):
        self.nw_["type"] = "nat"
        self.nw_["subnet4"] = "10.10.1.0/24"

        ok = Network._validate_network_conf(self.nw_)
        self.assertTrue(ok)
    # end test_validate_non_colliding_network_in_sys_v4

    def test_validate_colliding_network_in_sys_v4(self):
        self.nw_["type"] = "nat"
        self.nw_["subnet4"] = "20.20.1.0/24"

        ok = Network._validate_network_conf(self.nw_)
        self.assertFalse(ok)
    # end test_validate_colliding_network_in_sys_v4

    def test_validate_non_colliding_network_in_sys_v6(self):
        self.nw_["type"] = "nat"
        self.nw_["subnet4"] = "10.10.1.0/24"
        self.nw_["subnet6"] = "1234::10.10.1.0/120"

        ok = Network._validate_network_conf(self.nw_)
        self.assertTrue(ok)
    # end test_validate_non_colliding_network_in_sys_v6

    def test_validate_colliding_network_in_sys_v6(self):
        self.nw_["type"] = "nat"
        self.nw_["subnet4"] = "10.10.1.0/24"
        self.nw_["subnet6"] = "1234::20.20.1.0/120"

        ok = Network._validate_network_conf(self.nw_)
        self.assertFalse(ok)
    # end test_validate_colliding_network_in_sys_v6

    def test_validate_non_colliding_network_in_config_v4(self):
        self.nw_["type"] = "nat"
        self.nw_["subnet4"] = "10.10.1.0/24"

        ok = Network._validate_network_conf(self.nw_)
        self.assertTrue(ok)
    # end test_validate_non_colliding_network_in_config_v4

    def test_validate_colliding_network_in_config_v4(self):
        self.nw_["type"] = "nat"
        self.nw_["subnet4"] = "11.11.11.0/24"

        ok = Network._validate_network_conf(self.nw_)
        self.assertFalse(ok)
    # end test_validate_colliding_network_in_config_v4

    def test_validate_non_colliding_network_in_config_v6(self):
        self.nw_["type"] = "nat"
        self.nw_["subnet4"] = "10.10.1.0/24"
        self.nw_["subnet6"] = "1234::10.10.1.0/120"

        ok = Network._validate_network_conf(self.nw_)
        self.assertTrue(ok)
    # end test_validate_non_colliding_network_in_config_v6

    def test_validate_colliding_network_in_config_v6(self):
        self.nw_["type"] = "nat"
        self.nw_["subnet4"] = "11.11.11.0/24"
        self.nw_["subnet6"] = "1234::11.11.11.0/120"

        ok = Network._validate_network_conf(self.nw_)
        self.assertFalse(ok)
    # end test_validate_colliding_network_in_config_v6

    def test_add_v4_network(self):
        v4_nw_conf = {
            "name": "nw1",
            "type": "nat",
            "subnet4": "12.12.12.0/24"
        }
        v4_nw = Network(v4_nw_conf)
        self.assertEqual(v4_nw.network4_, ipaddress.IPv4Network('12.12.12.0/24'))
        self.assertEqual(v4_nw.ip4_, ipaddress.IPv4Network('12.12.12.0/24')[1])
        self.assertEqual(v4_nw.network6_, None)
        self.assertEqual(v4_nw.ip6_, None)
    # end test_add_v4_network

    def test_add_v6_network(self):
        nw_conf = {
            "name": "nw1",
            "type": "nat",
            "subnet4": "12.12.12.0/24",
            "subnet6": "1234::12.12.12.0/120"
        }
        nw1 = Network(nw_conf)
        self.assertEqual(nw1.network4_, ipaddress.IPv4Network('12.12.12.0/24'))
        self.assertEqual(nw1.ip4_, ipaddress.IPv4Network('12.12.12.0/24')[1])
        self.assertEqual(nw1.network6_, ipaddress.IPv6Network('1234::12.12.12.0/120'))
        self.assertEqual(nw1.ip6_, ipaddress.IPv6Network('1234::12.12.12.0/120')[1])
    # end test_add_v6_network
