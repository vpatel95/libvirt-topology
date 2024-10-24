import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import {Link} from 'react-router-dom';
import {getMemory, getFlavor} from 'utils';
import {VmAPI} from 'services/api';

export const VmDetail = ({vm}) => {
  return (
  <>
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h3>VM Details</h3>
                <ol>
                  <li>Name : {vm.name}</li>
                  <li>Flavor : {getFlavor(vm.flavor)}</li>
                  <li>Memory : {getMemory(vm.ram)}</li>
                  <li>vCPUs : {vm.vcpu}</li>
                  <li>Disk : {vm.disk}</li>
                  <li>VNC Port : {vm.vnc_port}</li>
                  <li>Topology : {vm.topology_id}</li>
                </ol>
              </div>
            </Row>
          </CardHeader>
          <CardBody>
          </CardBody>
        </Card>
      </Col>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h3>Attached Networks</h3>
                {vm.vm_net &&
                  vm.vm_net.map((vmNetwork, idx) => (
                  <ol key={idx}>
                    <li>Interface : {`enp${idx + 1}s0`}</li>
                    <li>IPv4 Address : {vmNetwork.ipv4_address}</li>
                    {vmNetwork.ipv6_address && (
                      <li>IPv6 Address : {vmNetwork.ipv6_address}</li>
                    )}
                  </ol>
                  ))
                }
              </div>
            </Row>
          </CardHeader>
          <CardBody>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
  )
};

export const VmDetailRow = (props) => {
  const {vms, setVms} = props;

  const deleteVm = (id) => {
    VmAPI.delete(id).then(
      res => {
        console.log("Virtual Machine deleted successfully : ", res);
        setVms(vms.filter((vm) => vm.ID !== id));
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
            <Link to={"/virtual-machines/" + vm.ID} state={vm}>
              <i className="fas fa-eye" style={{cursor: 'pointer', color: 'green'}} />
            </Link>
          </td>
        </tr>
      ))
    }
    </tbody>
  );
};

export const VmSummaryRow = (props) => {

  const {vms} = props;
  return (
    <tbody>
    {vms &&
      vms.map((vm) => (
        <tr key={vm.ID}>
          <th scope="row">
            <Link to={"/virtual-machines/" + vm.ID} state={vm}>
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
