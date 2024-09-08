import {useState} from 'react';
import {
  Card,
  Container,
  Row,
} from 'reactstrap';
import { useLoaderData, useLocation } from 'react-router-dom';

import {CardHeaderSimple} from '/src/components/Cards';
import {CreateVmForm} from '/src/components/Forms';
import {SessionStore} from '/src/services/store';
import { UserAPI } from '/src/services/api';

const loader = async () => {
  const user = SessionStore.getUser();

  const data = await UserAPI.getUserObjects(user?.id)
    .then(response => {
      return response
    }, error => {
      return error;
    });

  return data;
};

const action = async ({request}) => {
  const rawFormData = await request.formData();

  let formData = {
    name: rawFormData.get('name'),
    flavor: rawFormData.get('flavor'),
    vnc_port: parseInt(rawFormData.get('vnc_port'), 10),
    vcpus: parseInt(rawFormData.get('vcpus'), 10),
    ram: parseInt(rawFormData.get('ram'), 10),
    disk: rawFormData.get('disk'),
    networks: rawFormData.get('networks'),
  };

  debugger;
  console.log(formData);

  return null;
};

const CreateVirtualMachine = () => {
  const objects = useLoaderData();

  const { state } = useLocation();

  const initialState = {
    name: '', flavor: '', vnc_port: '',
    topology_id: state?.topologyId | '',
    vcpus: '', ram: '', disk: '', networks: [{
      id: '', ipv4_address: '', ipv6_address: ''
    }],
  }

  const [formData, setFormData] = useState(initialState);


  return (
    <Container className="pt-md-8" fluid>
      <Row className="align-items-center py-4">
        <div className="col">
          <Card className="shadow mb-3">
            <CardHeaderSimple header={"Create Virtual Machine"} />
            <Container className='p-md-3' fluid>
              <CreateVmForm formData={formData}
                setFormData={setFormData} init={initialState} objects={objects}
                state={state} />
            </Container>
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export {
  CreateVirtualMachine,
  loader,
  action,
};
