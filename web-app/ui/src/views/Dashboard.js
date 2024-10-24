import {useState} from 'react';
import { Container, Row, Col } from 'reactstrap';
import {useLoaderData} from 'react-router-dom';

import Header from 'components/Headers/Header.js';
import { TopologyTable, NetworkTable, VirtualMachineTable } from 'components/Tables';
import {UserAPI} from 'services/api';
import {SessionStore} from 'services/store';

export const loader = async () => {
  const user = SessionStore.getUser();

  const data = await UserAPI.getUserObjects(user?.id)
    .then(response => {
      return { data: response }
    }, error => {
      return { error };
    });

  return data;
};

export const Dashboard = () => {
  const {data} = useLoaderData();
  const [objects] = useState(data);

  return (
    <>
      <Header userObjects={objects} />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="6">
              <TopologyTable headers={["Name", "Networks", "VirtualMachines"]} 
                              topologies={objects?.topologies?.info} summary />
              <VirtualMachineTable
                headers={["Name", "Flavor", "Memory", "vCPU"]}
                vms={objects?.vms?.info} summary />
          </Col>
          <Col xl="6">
              <NetworkTable headers={["Name", "Type", "Topology"]}
                            networks={objects?.networks?.info} summary />
          </Col>
        </Row>
      </Container>
    </>
  )
};
