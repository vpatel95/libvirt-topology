import React from 'react';
import { getFlavor } from 'utils';
import {Link} from 'react-router-dom';
import {getMemory} from 'utils';
import VmService from 'services/vm';
import {useUser, UserActions} from 'contexts/UserContext';


export const VmDetailRow = ({vms}) => {

  const { userDispatch } = useUser();

  const deleteVm = (id) => {
    VmService.delete(id).then(
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
    <tbody>
    {vms &&
      vms.map((vm, index) => (
        <tr key={vm.ID}>
          <th scope="row">
            <span className="mb-0 text-sm">
              {index + 1}
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
            <i className="fas fa-trash" style={{cursor: 'pointer', color: 'red'}}
                onClick={deleteVm.bind(this, vm.ID)} />
          </td>
          <td>
            <Link to={"/user/virtual-machine/" + vm.ID} state={vm}>
              <i className="fas fa-eye" style={{cursor: 'pointer', color: 'green'}} />
            </Link>
          </td>
        </tr>
      ))
    }
    </tbody>
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
