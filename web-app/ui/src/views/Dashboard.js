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
import { Container, Row, Col, } from 'reactstrap';
import {Navigate} from 'react-router-dom';

import {useUser } from 'contexts/UserContext';
import Header from 'components/Headers/Header.js';
import { TopologyTable, NetworkTable, VirtualMachineTable } from 'components/Tables';

const Dashboard = () => {
  const { user } = useUser();

  if (!user.info) {
    console.log(user);
    return (
      <Navigate to="/auth/login" replace />
    );
  } else {
    return (
      <>
        <Header userObjects={user.objects} />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="6">
                <TopologyTable headers={["Name", "Networks", "VirtualMachines"]} 
                                topologies={user.objects.topologies.info} summary />
                <VirtualMachineTable
                  headers={["Name", "Flavor", "Memory", "vCPU"]}
                  vms={user.objects.vms.info} summary />
            </Col>
            <Col xl="6">
                <NetworkTable headers={["Name", "Type", "Topology"]}
                              networks={user.objects.networks.info} summary />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
};

export default Dashboard;
