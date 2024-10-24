import {
  Card,
  Container,
  Row,
} from 'reactstrap';
import {CardHeaderSimple} from 'components/Cards';
import {useState} from 'react';
import {CreateVmForm} from 'components/Forms';

export const CreateVirtualMachine = () => {

  const initialState = {
    name: '', flavor: '', vnc_port: '',
    topology_id: '', vcpu: '', ram: '',
    disk: '', networks: [{
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
                setFormData={setFormData} init={initialState} />
            </Container>
          </Card>
        </div>
      </Row>
    </Container>
  );
};
