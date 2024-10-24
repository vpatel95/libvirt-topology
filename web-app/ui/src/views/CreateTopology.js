import React, {useState} from "react";
import {
  Button,
  Card, Col, Container,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import {Form, redirect, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import {CardHeaderSimple} from 'components/Cards';
import {TopologyAPI} from "services/api";

export const createTopologyAction = async ({request}) => {
  const formData = Object.fromEntries(await request.formData());

  const response = await TopologyAPI.create(formData);

  if (response) {
    if (response.status >= 200 && response.status < 300) {
      toast.success('Topology Created Successfully', {
        autoClose: false,
        toastId: 'topoSuccess'
      });
      return redirect('/topologies');
    } else {
      toast.error('Topology Create Failed');
    }
  }

  return null;
};

export const TopologyCreate = () => {

  const initialData = { name: ''};
  const [formData, setFormData] = useState(initialData);

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
            <CardHeaderSimple header={"Create Topology"} />
            <Container fluid className="p-md-3">
              <Form method="POST">
                <FormGroup key="nameFg" row>
                  <Label for="name" sm={2}>Topology Name : </Label>
                  <Col sm={4}>
                    <Input
                      className="" type="text"
                      placeholder="Enter Topology Name"
                      name="name" value={formData["name"]}
                      onChange={changeHandler}/>
                  </Col>
                </FormGroup>
                <div className="text-center">
                  <Button onClick={() => navigate("/topologies")}
                    color="default">Back</Button>
                  <Button color="default" type="reset">Reset</Button>
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
