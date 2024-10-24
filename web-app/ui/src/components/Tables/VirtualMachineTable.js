import React from "react";
import {Button, Card, CardHeader, Table, Row} from "reactstrap";
import { TableHeader } from "./TableHeader";
import { getFlavor } from "utils";
import {Link} from "react-router-dom";
import {getMemory} from "utils";
import VmService from "services/vm";
import {useUser, UserActions} from "contexts/UserContext";


export const VmDetailRow = ({vm, index}) => {

  const { userDispatch } = useUser();

  const deleteVm = () => {
    VmService.delete(vm.ID).then(
      res => {
        console.log("Virtual Machine deleted successfully : ", res);
        userDispatch({type: UserActions.SET_NEWDATA, payload: true});
      },
      err => {
        console.error("Virtual Machine delete error : ", err);
      }
    );
  }

  return (
    <>
    <tr key={vm.ID}>
      <th scope="row">
        <span className="mb-0 text-sm">
          {index}
        </span>
      </th>
      <td>{vm.name}</td>
      <td>{getFlavor(vm.flavor)}</td>
      <td>{getMemory(vm.ram)}</td>
      <td>{vm.vcpu}</td>
      <td>{vm.disk}</td>
      <td>{vm.vnc_port}</td>
      <td>{vm.topology_id}</td>
      <td>
        <i className="fas fa-pencil" style={{cursor: 'pointer'}} />
      </td>
      <td>
        <i className="fas fa-trash" style={{cursor: 'pointer', color: 'red'}} onClick={deleteVm} />
      </td>
      <td>
        <Link to={"/user/virtual-machine/" + vm.ID} state={vm}>
          <i className="fas fa-eye" style={{cursor: 'pointer', color: 'green'}} />
        </Link>
      </td>
    </tr>
    </>
  );
};

export const VmSummaryRow = ({vms}) => {
  return (
    <tbody>
    {vms &&
      vms.map((vm) => (
        <tr key={vm.ID}>
          <th scope="row">
            <Link to={"/user/virtual-machine/" + vm.ID} state={vm}>
              {vm.name}
            </Link>
          </th>
          <td>{getFlavor(vm.flavor)}</td>
          <td>{getMemory(vm.ram)}</td>
          <td>{vm.vcpu}</td>
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
        <VmSummaryRow vms={vms} />
      </Table>
    </Card>
  );
};
