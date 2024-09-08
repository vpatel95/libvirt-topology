import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
} from 'reactstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {TopologyAPI} from '/src/services/api';
import { getMemory, getFlavor, getNetworkType } from '/src/utils';

export const TopologyNetworkDetail = (props) => {

  const topologyId = useParams();
  const navigate = useNavigate();

  const addNetwork = () => {
    navigate("/networks/create", {state: topologyId});
  };

  const {tname, networks, edit} = props;
  return (
    <Row className="mb-3">
      <div className="col">
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h3 className="mb-0">{ tname } Networks</h3>
              </div>
              {edit && (
                <Button onClick={addNetwork} color={"default"} className="mr-3">
                  Add Network
                </Button>
              )}
            </Row>
          </CardHeader>
          <CardBody>
            <Row>
            { networks &&
              networks.map((network) => (
                <Col xs={12} sm={6} lg={4} key={tname + "-net" + network.ID} >
                  <Card className="mb-3 border-light rounded" >
                    <CardHeader className="border-0 bg-light">
                      <Row className="align-items-center">
                        <div className="col">
                          <h3 className="mb-0">{network.name}</h3>
                        </div>
                      </Row>
                    </CardHeader>
                    <Table responsive>
                      <tbody>
                        <tr>
                          <th>Type</th><td>{getNetworkType(network.Type)}</td>
                        </tr>
                        <tr>
                          <th>IPv4 Subnet</th><td>{network.subnet4}</td>
                        </tr>
                        { network.has_v6 && (
                          <tr>
                            <th>IPv6 Subnet</th><td>{network.subnet6}</td>
                          </tr>
                          )
                        }
                        <tr>
                        </tr>
                      </tbody>
                    </Table>
                  </Card>
                </Col>
              ))
            }
            </Row>
          </CardBody>
        </Card>
      </div>
    </Row>
  );
};

export const TopologyVmDetail = (props) => {

  const topologyId = useParams();
  const navigate = useNavigate();

  const addVirtualMachine = () => {
    navigate("/virtual-machines/create", {state: topologyId});
  };

  const { tname, vms, edit } = props;
  return (
    <Row className="mb-3">
      <div className="col">
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h3>{ tname } Virtual Machines</h3>
              </div>
              {edit && (
                <Button onClick={addVirtualMachine} color={"default"} className={"mr-3"}>
                  Add Virtual Machine
                </Button>
              )}
            </Row>
          </CardHeader>
          <CardBody>
            <Row>
            { vms &&
              vms.map((vm) => (
                <Col xs={12} sm={6} lg={3} key={tname + "-vm" + vm.ID} >
                  <Card className="mb-3 border-light rounded">
                    <CardHeader className="border-0 bg-light">
                      <Row className="align-items-center">
                        <div className="col">
                          <h3 className="mb-0">{vm.name}</h3>
                        </div>
                      </Row>
                    </CardHeader>
                    <Table responsive>
                      <tbody>
                        <tr>
                          <th>Flavor</th><td>{getFlavor(vm.flavor)}</td>
                        </tr>
                        <tr>
                          <th>Memory</th><td>{getMemory(vm.ram)}</td>
                        </tr>
                        <tr>
                          <th>vCPUs</th><td>{vm.vcpu}</td>
                        </tr>
                        <tr>
                          <th>Disk</th><td>{vm.disk}</td>
                        </tr>
                        <tr>
                          <th>VNC Port</th><td>{vm.vnc_port}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card>
                </Col>
              ))
            }
            </Row>
          </CardBody>
        </Card>
      </div>
    </Row>
  );
};

export const TopologyDetailRow = (props) => {

  const {topologies, setTopologies} = props;

  const deleteTopology = (id) => {
    TopologyAPI.delete(id).then(
      res => {
        console.log("Topology deleted successfully : ", res);
        setTopologies(topologies.filter((topology) => topology.ID !== id));
        toast.success('Topology Successfully Deleted');
      },
      err => {
        console.error("Topology delete error : ", err);
        toast.error('Topology Delete Error');
      }
    );
  }

  return (
    <tbody>
    {topologies &&
      topologies.map((topology, index) => (
        <tr key={topology.ID}>
          <th scope="row">
            <span className="mb-0 text-sm">
              {index + 1}
            </span>
          </th>
          <td>{topology.name}</td>
          <td>{topology.Networks.length}</td>
          <td>{topology.VirtualMachines.length}</td>
          <td>
            <Link to={"/topologies/" + topology.ID + "/edit"} state={{edit: true}}>
              <i className="fas fa-pencil" style={{cursor: 'pointer'}} />
            </Link>
          </td>
          <td>
            <i className="fas fa-trash" style={{cursor: 'pointer', color: 'red'}}
                onClick={deleteTopology.bind(this, topology.ID)} />
          </td>
          <td>
            <Link to={"/topologies/" + topology.ID} >
              <i className="fas fa-eye" style={{cursor: 'pointer', color: 'green'}} />
            </Link>
          </td>
        </tr>
      ))
    }
    </tbody>
  );
};

export const TopologySummaryRow = (props) => {

  const {topologies} = props;

  return (
    <tbody>
    {topologies &&
      topologies.map((topology) => (
        <tr key={topology.ID}>
          <th scope="row">
            <Link to={"/topologies/" + topology.ID} state={topology}>
              {topology.name}
            </Link>
          </th>
          <td>{topology.Networks.length}</td>
          <td>{topology.VirtualMachines.length}</td>
        </tr>
      ))
    }
    </tbody>
  );
};

