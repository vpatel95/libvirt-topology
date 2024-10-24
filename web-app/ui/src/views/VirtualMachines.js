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
// reactstrap components
import {
  Card,
  Container,
  Row,
} from 'reactstrap';
import {CardHeaderSimple} from 'components/Cards';
import {BaseForm} from 'components/Forms';
import {VirtualMachineTable} from 'components/Tables';
import {useLoaderData} from 'react-router-dom';

const VirtualMachines = () => {

  const vms = useLoaderData();

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row>
          <div className="col">
            <Card className="shadow mb-3">
                <VirtualMachineTable headers={[ "S. No", "Name", "Flavor",
                    "RAM", "vCPUs", "Disk", "VNC Port", "Topology ID",
                    "Edit", "Delete", "View" ]} vms={vms} />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export const VmCreate = () => {
  const formFields = [
    {name: 'name', label: 'Name'},
    {name: 'type', label: 'Type', type: 'select',
      options: [
        {label: 'PE', value: 'pe'},
        {label: 'CE', value: 'ce'},
        {label: 'Dev', value: 'dev'}
      ],
    },
    {name: 'subnet4', label: 'Subnet v4' },
    {name: 'custom_res', label: 'Configure Custom Resources', type: 'checkbox',
      conditional : [
        { name: 'vcpus', label: 'vCPUs', type: 'number' },
        { name: 'disk', label: 'Disk' },
        { name: 'ram', label: 'Memory', type: 'number' },
      ],
    },
  ];

  return (
    <Container className="pt-md-8" fluid>
      <Row className="align-items-center py-4">
        <div className="col">
          <Card className="shadow mb-3">
            <CardHeaderSimple header={"Create Virtual Machine"} />
            <BaseForm formFields={formFields} buttonLabel="Submit" method="POST"
                action={""} />
          </Card>
        </div>
      </Row>
    </Container>
  );
};
export default VirtualMachines;
