/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import {TopologyDetailRow, TopologyNetworkDetail, TopologyVmDetail} from "components/Tables/TopologyTable";
import { useUser } from "contexts/UserContext";
import TopologyService from "services/topology";
import {UserActions} from "contexts/UserContext";
import {useLocation} from "react-router-dom";

export const CreateTopologyModal = ({isOpen, toggle}) => {
  const { userDispatch } = useUser();
  const [formData, setFormData] = React.useState({
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createTopology = () => {
    TopologyService.create(formData).then(
      res => {
        console.log("Topology create success : ", res);
        userDispatch({type: UserActions.SET_NEWDATA, payload: true});
      },
      err => {
        console.error("Topology create error : ", err);
      }
    );
    toggle();
  };

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} size="md">
        <ModalHeader toggle={toggle}>Create Topology</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label htmlFor="topologyName">
                  Topology Name
              </Label>
              <Input
                id="topologyName"
                name="name"
                placeholder="Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createTopology}>
            Create
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const Topologies = () => {
  const { user } = useUser();

  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);

  return (
    <>
      <Header userObjects={user.objects} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">Topologies</h2>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" size="md" onClick={toggle}>Create</Button>
                  </div>
                  <CreateTopologyModal isOpen={modal} toggle={toggle}/>
                </Row>
              </CardHeader>
              <Table className="align-items-center text-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">S. No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Networks</th>
                    <th scope="col">Virtual Machines</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                    <th scope="col">View</th>
                  </tr>
                </thead>
                <tbody>
                {user.objects.topologies.info &&
                  user.objects.topologies.info.map((topology, idx) => (
                    <TopologyDetailRow topology={topology} index={idx + 1} key={topology.ID}/>
                  ))
                }
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export const Topology = () => {
  const { user } = useUser();
  const location = useLocation();
  const topology = location.state;

  return (
    <>
      <Header userObjects={user.objects} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card>
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">{topology.name} Topology</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <TopologyNetworkDetail tname={topology.name} networks={topology.Networks}/>
                <TopologyVmDetail tname={topology.name} vms={topology.VirtualMachines}/>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Topologies;
