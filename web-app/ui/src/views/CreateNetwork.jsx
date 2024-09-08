import React, {useState} from "react";
import {Form, redirect, useLoaderData, useLocation, useNavigate} from 'react-router-dom';
import {
  Button,
  Card, Col, Container,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import {toast} from 'react-toastify';

import {CardHeaderSimple} from "/src/components/Cards";
import {NetworkAPI, UserAPI} from "/src/services/api";
import {SessionStore} from "/src/services/store";

const loader = async () => {
  const user = SessionStore.getUser();

  const data = await UserAPI.topologies(user?.id)
    .then(response => {
      return response?.data?.data;
    }, error => {
      return error;
    });

  return data;
};

const action = async ({request}) => {
  const formData = Object.fromEntries(await request.formData());

  formData.has_v6 = (formData.has_v6 === "true");
  formData.topology_id = parseInt(formData.topology_id, 10);

  const response = await NetworkAPI.create(formData);

  if (response) {
    if (response.status >= 200 && response.status < 300) {
      toast.success('Network Created Successfully', {
        autoClose: false,
        toastId: 'nwSuccess'
      });

      return redirect('/user/networks');

    } else {
      toast.error('Network Create Failed');
    }
  }
  return null;
};

const NetworkCreate = () => {
  const topologies = useLoaderData();

  const {state} = useLocation();

  const initialState = {
    name: '', type: '', subnet4: '', subnet6: '',
    has_v6: false, topology_id: state?.topologyId | ''
  };
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <Container className="pt-md-8" fluid>
      <Row className="align-items-center py-4">
        <div className="col">
          <Card className="shadow mb-3">
            <CardHeaderSimple header={"Create Network"} />
            <Container className="p-md-3" fluid>
              <Form method="POST">
                <FormGroup key="nameFg" row>
                  <Label for="name" sm={2}>Network Name : </Label>
                  <Col sm={4}>
                    <Input
                      className="" type="text"
                      placeholder="Enter Network Name"
                      name="name" value={formData.name}
                      onChange={changeHandler}/>
                  </Col>
                </FormGroup>
                <FormGroup key="typeFg" row>
                  <Label for="type" sm={2}>Network Type : </Label>
                  <Col sm={4}>
                    <Input
                      className="" type="select"
                      name="type" value={formData.type}
                      onChange={changeHandler}>
                      <option value="">--- Select Network Type ---</option>
                      <option value="nat">NAT</option>
                      <option value="management">Management</option>
                      <option value="isolated">Host Only Network</option>
                    </Input>
                  </Col>
                </FormGroup>
                {formData.type !== "isolated" && (
                  <>
                    <FormGroup key="subnet4Fg" row>
                      <Label for="subnet4" sm={2}>IPv4 Network Subnet : </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                          placeholder="Enter IPv4 Network Subnet"
                          name="subnet4" value={formData.subnet4}
                          onChange={changeHandler}/>
                      </Col>
                    </FormGroup>
                    <FormGroup key="hasv6Fg" row>
                      <Label for="has_v6" sm={2}>Has IPv6 Subnet?</Label>
                      <Col sm={4}>
                        <Input
                          className="ml-1 mt-3" type="checkbox"
                          name="has_v6" value={formData.has_v6}
                          onChange={changeHandler}
                          disabled={formData.type === 'management'} />
                      </Col>
                    </FormGroup>
                    {formData.has_v6 && formData.type !== 'management' && (
                    <FormGroup key="subnet6Fg" row>
                      <Label for="subnet6" sm={2}>IPv6 Network Subnet : </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                          placeholder="Enter IPv6 Network Subnet"
                          name="subnet6" value={formData.subnet6}
                          onChange={changeHandler}/>
                      </Col>
                    </FormGroup>
                    )}
                  </>
                )}
                <FormGroup key="topologyIdFg" row>
                  <Label for="topology_id" sm={2}>Topology : </Label>
                  <Col sm={4}>
                    <Input
                      className="" type="select"
                      name="topology_id" value={formData.topology_id}
                      onChange={changeHandler} disabled={!!(state?.topologyId)}>
                      <option value="0">--- Select Topology ---</option>
                      {topologies &&
                        topologies.map((topology, index) => (
                          <option key={index} value={topology.ID}>{topology.name}</option>
                        ))
                      }
                    </Input>
                  </Col>
                </FormGroup>
                <div className="text-center">
                  <Button onClick={()=> navigate("/networks")}
                    color="default">Back</Button>
                  <Button color="default" type="reset"
                      onClick={() => setFormData(initialState)}>Reset</Button>
                  <Button color="default" type="submit">Submit</Button>
                </div>
              </Form>
            </Container>
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export {
  NetworkCreate,
  loader,
  action,
};
