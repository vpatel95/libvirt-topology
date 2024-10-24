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
  CardHeader,
  Container,
  Row,
  Table,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import {useUser} from "contexts/UserContext";
import {VmDetailRow} from "components/Tables/VirtualMachineTable";
import { TableHeader } from "components/Tables/TableHeader";

const VirtualMachines = () => {
  const { user } = useUser();
  return (
    <>
      <Header userObjects={user.objects} />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Virtual Machines</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <TableHeader headers={[ "S. No", "Name", "Flavor",
                    "RAM", "vCPUs", "Disk", "VNC Port", "Topology ID",
                    "Edit", "Delete", "View" ]} />
                <tbody>
                {user.objects.vms.info &&
                  user.objects.vms.info.map((vm, idx) => (
                    <VmDetailRow vm={vm} index={idx + 1} key={vm.ID} />
                  ))
                }
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default VirtualMachines;
