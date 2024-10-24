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
  CardBody,
  CardHeader,
  Container,
  Row,
} from 'reactstrap';
import {useLoaderData, Link} from 'react-router-dom';
import {NetworkDetail} from 'components/Networks';
import {NetworkTable} from 'components/Tables';
import {CardHeaderSimple} from 'components/Cards';
import {BaseForm} from 'components/Forms';

const Networks = () => {

  const networks = useLoaderData();

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row>
          <div className="col">
            <Card className="shadow mb-3">
              <NetworkTable
                headers={["S. No", "Name", "Type", "IPv4 Address", "IPv6 Address",
                          "Topology ID", "Delete", "View"]}
                networks={networks} />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export const Network = () => {

  const {network, attachedVms} = useLoaderData();

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">{network.name} Network</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <NetworkDetail network={network} attachedVms={attachedVms}/>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
};

export const NetworkCreate = () => {
  const formFields = [
    {name: 'name', label: 'Name'},
    {name: 'type', label: 'Type', type: 'select',
      options: [
        {label: 'NAT', value: 'nat'},
        {label: 'Management', value: 'management'},
        {label: 'Host Only Network', value: 'isolated'}
      ],
    },
    {name: 'subnet4', label: 'Subnet v4' },
    {name: 'has_v6', label: 'Has v6', type: 'checkbox',
      conditional : [
        { name: 'subnet6', label: 'Subnet v6' }
      ],
    },
  ];

  return (
    <Container className="pt-md-8" fluid>
      <Row className="align-items-center py-4">
        <div className="col">
          <Card className="shadow mb-3">
            <CardHeaderSimple header={"Create Network"} />
            <BaseForm formFields={formFields} buttonLabel="Submit" method="POST"
                action={""} />
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default Networks;
