import {useState} from 'react';
import {
  Card,
  Container,
  Row,
} from 'reactstrap';
import {VirtualMachineTable} from 'components/Tables';
import {useLoaderData} from 'react-router-dom';
import {UserAPI} from 'services/api';
import {SessionStore} from 'services/store';

const loader = async () => {
  const user = SessionStore.getUser();

  const data = await UserAPI.vms(user?.id)
    .then(response => {
      return { data: response?.data?.data };
    }, error => {
      return { error }
    });

  return data;
};

const VirtualMachines = () => {
  const {data} = useLoaderData();
  const [vms, setVms] = useState(data);

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row>
          <div className="col">
            <Card className="shadow mb-3">
                <VirtualMachineTable headers={[ "S. No", "Name", "Flavor",
                    "RAM", "vCPUs", "Disk", "VNC Port", "Topology ID",
                    "Edit", "Delete", "View" ]}
                vms={vms} setVms={setVms} />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export {
  VirtualMachines,
  loader
};
