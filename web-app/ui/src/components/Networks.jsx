import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import {Link} from 'react-router-dom';

import { getNetworkType } from '/src/utils';
import {NetworkAPI} from '/src/services/api';

export const NetworkDetail = ({network, attachedVms}) => {
  return (
  <>
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h3>Networks Details</h3>
                <ol>
                  <li>Name : {network.name}</li>
                  <li>Type : {network.Type}</li>
                  <li>IPv4 Subnet : {network.subnet4}</li>
                  <li>IPv4 Address : {network.addr_v4}</li>
                  { network.has_v6 && (<>
                      <li>IPv6 Subnet : {network.subnet6}</li>
                      <li>IPv6 Address : {network.addr_v6}</li>
                    </>)
                  }
                  <li>Topology : {network.topology_id}</li>
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
                <h3>Attached Virtual Machines</h3>
                { attachedVms && attachedVms.map((vm, index) => (<>
                  <ol key={index}>
                    <li>Name : {vm.Name}</li>
                    <li>IPv4 Address : {vm.IPv4Address}</li>
                    { vm.IPv6Address && (
                      <>
                        <li>IPv6 Address : {vm.IPv6Address}</li>
                      </>)
                    }
                  </ol>
                  </>))
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

export const NetworkDetailRow = (props) => {

  const {networks, setNetworks} = props;

  const deleteNetwork = (id) => {
    NetworkAPI.delete(id).then(
      res => {
        console.log("Network deleted successfully : ", res);
        setNetworks(networks.filter((network) => network.ID !== id));
      },
      err => {
        console.error("Network delete error : ", err);
      }
    );
  }

  return (
    <tbody>
    {networks &&
      networks.map((network, index) => (
        <tr key={network.ID}>
          <th scope="row">
            <span className="mb-0 text-sm">
              {index + 1}
            </span>
          </th>
          <td>{network.name}</td>
          <td>{getNetworkType(network.Type)}</td>
          <td>{network.subnet4 ? network.subnet4 : "N/A"}</td>
          <td>{network.has_v6 ? network.subnet6 : "N/A"}</td>
          <td>{network.topology_id}</td>
          <td>
            <i className="fas fa-trash" style={{cursor: 'pointer', color: 'red'}}
                onClick={deleteNetwork.bind(this, network.ID)} />
          </td>
          <td>
            <Link to={"/networks/" + network.ID} state={network}>
              <i className="fas fa-eye" style={{cursor: 'pointer', color: 'green'}} />
            </Link>
          </td>
        </tr>
      ))
    }
    </tbody>
  )
};

export const NetworkSummaryRow = ({networks}) => {

  return (
    <tbody>
    {networks &&
      networks.map((network) => (
        <tr key={network.ID}>
          <th scope="row">
            <Link to={"/networks/" + network.ID} state={network}>
              {network.name}
            </Link>
          </th>
          <td>{getNetworkType(network.Type)}</td>
          <td>{network.topology_id}</td>
        </tr>
      ))
    }
    </tbody>
  );
};

