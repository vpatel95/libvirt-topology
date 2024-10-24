import { useState } from 'react';
import { Container, Row } from 'reactstrap';
import { useLoaderData, useLocation } from 'react-router-dom';
import {toast} from 'react-toastify';

import { TopologyAPI } from 'services/api';
import { TopologyNetworkDetail, TopologyVmDetail } from 'components/Topologies'

export const loader = async ({params}) => {
  const data = await TopologyAPI.get(params.topologyId)
    .then(response => {
      return { data: response?.data?.data };
    }, error => {
        // TODO: Add meaningful error
        toast.error("Error occured!");
        return { error };
    });

  return data;
};

export const Topology = () => {
  const { data } = useLoaderData();
  const [topology] = useState(data);

  const {state} = useLocation();

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row className="align-items-center text-center py-4">
          <div className="col">
            <h1 className="mb-0">{topology?.name} Topology</h1>
          </div>
        </Row>
        <Row>
          <TopologyNetworkDetail tname={topology?.name}
            networks={topology?.Networks} edit={!!(state?.edit)} />
          <TopologyVmDetail tname={topology?.name}
            vms={topology?.VirtualMachines} edit={state?.edit} />
        </Row>
      </Container>
    </>
  )
};

