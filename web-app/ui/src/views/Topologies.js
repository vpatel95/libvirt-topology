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
import React from 'react';
import {
  Card,
  Container,
  Row,
} from 'reactstrap';
import {useLoaderData } from 'react-router-dom';

import {TopologyNetworkDetail, TopologyVmDetail} from 'components/Topologies'
import {TopologyTable} from 'components/Tables';
import {BaseForm} from 'components/Forms';
import {CardHeaderSimple} from 'components/Cards';

const Topologies = () => {
  const topologies = useLoaderData();

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row>
          <div className="col">
            <TopologyTable
              headers={["S. No", "Name", "Networks", "Virtual Machines",
                "Edit", "Delete", "View"]}
              topologies={topologies} />
          </div>
        </Row>
      </Container>
    </>
  );
};

export const Topology = () => {
  const topology = useLoaderData();

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row className="align-items-center text-center py-4">
          <div className="col">
            <h1 className="mb-0">{topology.name} Topology</h1>
          </div>
        </Row>
        <Row>
          <TopologyNetworkDetail tname={topology.name} networks={topology.Networks}/>
          <TopologyVmDetail tname={topology.name} vms={topology.VirtualMachines}/>
        </Row>
      </Container>
    </>
  );
};

export const TopologyCreate = () => {

  const formFields = [
    {name: 'name', label: 'Topology Name'}
  ];

  return (
    <Container className="pt-md-8" fluid>
      <Row className="align-items-center py-4">
        <div className="col">
          <Card className="shadow mb-3">
            <CardHeaderSimple header={"Create Topology"} />
            <BaseForm formFields={formFields} buttonLabel="Submit" method="POST"
                action={""} />
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default Topologies;
