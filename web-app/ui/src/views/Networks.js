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
  CardHeader,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
  Table,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { useUser, UserActions } from "contexts/UserContext";
import NetworkService from "services/network";

export const CreateNetworkModal = ({isOpen, toggle}) => {
  const { userDispatch } = useUser();
  const [formData, setFormData] = React.useState({
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createNetwork = () => {
    NetworkService.create(formData).then(
      res => {
        console.log("Network create success : ", res);
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
        <ModalHeader toggle={toggle}>
          <h2>Create Network</h2>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="networkName">
                  Network Name
              </Label>
              <Input
                id="networkName"
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
          <Button color="primary" onClick={createNetwork}>
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

const Networks = () => {
  const { user } = useUser();
  return (
    <>
      <Header userObjects={user.objects} />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Networks</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">S. No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Topology ID</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  { /* add topology detail row */ }
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Networks;
