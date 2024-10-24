import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Table,
  Row
} from "reactstrap";
import { TableHeader } from "./TableHeader";
import { getMemory, getFlavor, getNetworkType } from "utils";
import {Link} from "react-router-dom";
import TopologyService from "services/topology";
import {UserActions, useUser} from "contexts/UserContext";
import { CreateNetworkModal } from "views/Networks";

export const TopologyNetworkDetail = ({tname, networks}) => {
  const [modal, setModal] = React.useState(false);

  const toggle = () => setModal(!modal);

  return (
    <Row className="mb-3">
      <div className="col">
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h3>{ tname } Networks</h3>
              </div>
              <div className="col text-right">
                <Button color="primary" size="md" onClick={toggle}>Create</Button>
              </div>
              <CreateNetworkModal isOpen={modal} toggle={toggle} />
            </Row>
          </CardHeader>
          <CardBody>
            <Row>
            { networks &&
              networks.map((network) => (
                <Col xs={12} sm={6} lg={4} key={tname + "-net" + network.ID} >
                  <Card className="shadow mb-3" outline color="dark">
                    <CardHeader className="border-0">
                      <Row className="align-items-center">
                        <div className="col">
                          <h3 className="mb-0">{network.name}</h3>
                        </div>
                        <div className="col text-right">
                          <i className="fas fa-pencil" size="md" onClick={toggle} style={{cursor: 'pointer'}}/>
                        </div>
                      </Row>
                    </CardHeader>
                    <Table striped responsive>
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

export const TopologyVmDetail = ({tname, vms}) => {
  return (
    <Row className="mb-3">
      <div className="col">
        <Card className="shadow">
          <CardHeader className="border-0">
            <h2>{ tname } Virtual Machines</h2>
          </CardHeader>
          <CardBody>
            <Row>
            { vms &&
              vms.map((vm) => (
                <Col xs={12} sm={6} lg={3} key={tname + "-vm" + vm.ID} >
                  <Card className="shadow">
                    <CardHeader className="border-0">
                      <h3 className="mb-0">{vm.name}</h3>
                    </CardHeader>
                    <Table striped responsive>
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

export const TopologyDetailRow = ({topology, index}) => {

  const { userDispatch } = useUser();

  const deleteTopology = () => {
    TopologyService.delete(topology.ID).then(
      res => {
        console.log("Topology deleted successfully : ", res);
        userDispatch({type: UserActions.SET_NEWDATA, payload: true});
      },
      err => {
        console.error("Topology delete error : ", err);
      }
    );
  }

  return (
    <>
    <tr key={topology.ID}>
      <th scope="row">
        <span className="mb-0 text-sm">
          {index}
        </span>
      </th>
      <td>{topology.name}</td>
      <td>{topology.Networks.length}</td>
      <td>{topology.VirtualMachines.length}</td>
      <td>
        <i className="fas fa-pencil" style={{cursor: 'pointer'}} />
      </td>
      <td>
        <i className="fas fa-trash" style={{cursor: 'pointer', color: 'red'}} onClick={deleteTopology} />
      </td>
      <td>
        <Link to={"/user/topology/" + topology.ID} state={topology}>
          <i className="fas fa-eye" style={{cursor: 'pointer', color: 'green'}} />
        </Link>
      </td>
    </tr>
    </>
  );
};

export const TopologySummaryRow = ({topologies}) => {
  return (
    <tbody>
    {topologies &&
      topologies.map((topology) => (
        <tr key={topology.ID}>
          <th scope="row">
            <Link to={"/user/topology/" + topology.ID} state={topology}>
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

export const TopologyTable = ({headers, topologies}) => {
  return (
    <Card className="shadow mb-3">
      <CardHeader className="border-0">
        <Row className="align-items-center">
          <div className="col">
            <h3 className="mb-0">Topologies</h3>
          </div>
          <div className="col text-right">
            <Link to="/user/topologies">
              <Button color="primary" size="sm"> See all </Button>
            </Link>
          </div>
        </Row>
      </CardHeader>
      <Table className="align-items-center table-flush" responsive>
        <TableHeader headers={headers} />
        <TopologySummaryRow topologies={topologies} />
      </Table>
    </Card>
  );
};
