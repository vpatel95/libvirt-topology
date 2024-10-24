import {
  Button, Col, FormGroup, Input, Label, Row
} from 'reactstrap';

import {Form, useNavigate} from 'react-router-dom';

export const CreateVmForm = (props) => {
  const {formData, setFormData, init} = props;
  const navigate = useNavigate();


  const addNetwork = () => {
    setFormData({...formData,
      networks: [...formData.networks, {
        id: '', ipv4_address: '', ipv6_address: ''
      }]
    });
  };

  const deleteNetwork = (idx) => {
    const nws = [...formData.networks];
    setFormData({...formData,
      networks: nws.filter((_, index) => index !== idx)
    });
  };

  const updateNetworks = (e, idx) => {
    const { name, value } = e.target;

    const updatedNetworks = [...formData.networks];
    updatedNetworks[idx][name] = value;
    setFormData({...formData, networks: updatedNetworks});
  };

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;

    let newData = { ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };

    if (name === 'flavor') {
      switch(value) {
        case "pe":
          newData = { ...newData, vcpu: 4, disk: '80G', ram: 16384 };
          break;
        case "ce":
          newData = { ...newData, vcpu: 2, disk: '40G', ram: 8192 };
          break;
        default:
          newData = { ...newData, vcpu: '', disk: '', ram: '' };
          break;
      }
    }
    setFormData(newData);
  };

  return (
    <Form method="POST">
      <FormGroup key="nameFg" row>
        <Label for="name" sm={2}>Name : </Label>
        <Col sm={4}>
          <Input
            type="text"
            placeholder="Enter VM Name"
            name="name" value={formData.name}
            onChange={changeHandler}/>
        </Col>
      </FormGroup>
      <FormGroup key="flavorFg" row>
        <Label for="flavor" sm={2}>Flavor : </Label>
        <Col sm={4}>
          <Input
            className="" type="select"
            name="flavor" value={formData.flavor}
            onChange={changeHandler}>
            <option value="">--- Select Flavor ---</option>
            <option value="pe">Provider Edge</option>
            <option value="ce">Customer Edge</option>
            <option value="custom">Custom</option>
          </Input>
        </Col>
      </FormGroup>
      <FormGroup key="vcpuFg" row>
        <Label for="vcpu" sm={2}>vCPUs : </Label>
        <Col sm={4}>
          <Input
            type="number"
            min="1" max="50"
            placeholder="Enter Number of vCPUs"
            name="vcpu" value={formData.vcpu}
            onChange={changeHandler}
            disabled={formData.flavor !== 'custom'} />
        </Col>
      </FormGroup>
      <FormGroup key="ramFg" row>
        <Label for="ram" sm={2}>Memory : </Label>
        <Col sm={4}>
          <Input
            type="number"
            min="1024" max="131328"
            placeholder="Enter Memory in MBs"
            name="ram" value={formData.ram}
            onChange={changeHandler}
            disabled={formData.flavor !== 'custom'} />
        </Col>
      </FormGroup>
      <FormGroup key="diskFg" row>
        <Label for="disk" sm={2}>Disk : </Label>
        <Col sm={4}>
          <Input
            type="text"
            placeholder="Enter Disk size like 40G, 80G"
            name="disk" value={formData.disk}
            onChange={changeHandler}
            disabled={formData.flavor !== 'custom'} />
        </Col>
      </FormGroup>
      <br />
      <Row className='mb-4'>
        <Col sm={6}>
          <h1> Attach Networks </h1>
        </Col>
        <Col sm={2}>
          <Button color='success'
            onClick={() => addNetwork()}>Add Network</Button>
        </Col>
      </Row>
      {formData.networks &&
        formData.networks.map((network, idx) => (
          <Row key={idx}>
            <Col sm={8}>
              <FormGroup row>
                <Col sm={4}>
                  <Input
                    name="id"
                    placeholder="Choose Network"
                    value={network.id} type="select"
                    onChange={(e) => updateNetworks(e, idx)}>
                    <option value="1">Network 1</option>
                    <option value="2">Network 2</option>
                    <option value="3">Network 3</option>
                  </Input>
                </Col>
                <Col sm={3}>
                  <Input
                    name="ipv4_address"
                    placeholder="Enter IPv4 Address"
                    value={network.ipv4_address}
                    type="text" onChange={(e) => updateNetworks(e, idx)}
                  />
                </Col>
                <Col sm={3}>
                  <Input
                    name="ipv6_address"
                    placeholder="Enter IPv6 Address"
                    value={network.ipv6_address}
                    type="text" onChange={(e) => updateNetworks(e, idx)}
                  />
                </Col>
                <Col sm={2}>
                  <Button color='danger' onClick={() => deleteNetwork(idx)}>
                    <i className='fas fa-trash' />
                  </Button>
                </Col>
              </FormGroup>
            </Col>
          </Row>
        ))
      }
      <div className="text-center">
        <Button onClick={() => navigate("/virtual-machines")}
          color="default">Back</Button>
        <Button color="default" type="reset"
          onClick={() => setFormData(init)}>Reset</Button>
        <Button color="default" type="submit">Submit</Button>
      </div>
    </Form>
  );
};
