import React from "react";
import {Button, Card, CardHeader, Table, Row} from "reactstrap";
import { TableHeader } from "./TableHeader";
import { getFlavor } from "utils";
import {Link} from "react-router-dom";
import {getMemory} from "utils";

export const VirtualMachineTableRow = ({vms}) => {
  return (
    <tbody>
    {vms &&
      vms.map((vm) => (
        <tr key={vm.ID}>
          <th scope="row">{vm.name}</th>
          <td>{getFlavor(vm.flavor)}</td>
          <td>{getMemory(vm.ram)}</td>
          <td>{vm.vcpu}</td>
          <td>{vm.disk}</td>
          <td>{vm.vnc_port}</td>
        </tr>
      ))
    }
    </tbody>
  );
};

export const VirtualMachineTable = ({headers, vms}) => {
  return (
    <Card className="shadow mb-3">
      <CardHeader className="border-0">
        <Row className="align-items-center">
          <div className="col">
              <h3 className="mb-0">Virtual Machines</h3>
          </div>
          <div className="col text-right">
            <Link to="/user/virtual-machines">
              <Button color="primary" size="sm" > See all </Button>
            </Link>
          </div>
        </Row>
      </CardHeader>
      <Table className="align-items-center table-flush" responsive>
        <TableHeader headers={headers} />
        <VirtualMachineTableRow vms={vms} />
      </Table>
    </Card>
  );
};
