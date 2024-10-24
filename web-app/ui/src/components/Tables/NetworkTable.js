import React from "react";
import {Button, Card, CardHeader, Table, Row} from "reactstrap";
import { TableHeader } from "components/Tables/TableHeader";
import { getNetworkType } from "utils";
import {Link} from "react-router-dom";
import NetworkService from "services/network";
import {useUser, UserActions} from "contexts/UserContext";

export const NetworkDetailRow = ({network, index}) => {
  const { userDispatch } = useUser();

  const deleteNetwork = () => {
    NetworkService.delete(network.ID).then(
      res => {
        console.log("Network deleted successfully : ", res);
        userDispatch({type: UserActions.SET_NEWDATA, payload: true});
      },
      err => {
        console.error("Network delete error : ", err);
      }
    );
  }

  return (
    <>
    <tr key={network.ID}>
      <th scope="row">
        <span className="mb-0 text-sm">
          {index}
        </span>
      </th>
      <td>{network.name}</td>
      <td>{getNetworkType(network.Type)}</td>
      <td>{network.subnet4 ? network.subnet4 : "N/A"}</td>
      <td>{network.has_v6 ? network.subnet6 : "N/A"}</td>
      <td>{network.topology_id}</td>
      <td>
        <i className="fas fa-trash" style={{cursor: 'pointer', color: 'red'}} onClick={deleteNetwork} />
      </td>
      <td>
        <Link to={"/user/network/" + network.ID} state={network}>
          <i className="fas fa-eye" style={{cursor: 'pointer', color: 'green'}} />
        </Link>
      </td>
    </tr>
    </>
  )
};

export const NetworkSummaryRow = ({networks}) => {

  return (
    <tbody>
    {networks &&
      networks.map((network) => (
        <tr key={network.ID}>
          <th scope="row">
            <Link to={"/user/network/" + network.ID} state={network}>
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

export const NetworkTable = ({headers, networks}) => {
  return (
    <Card className="shadow mb-3">
      <CardHeader className="border-0">
        <Row className="align-items-center">
          <div className="col">
              <h3 className="mb-0">Networks</h3>
          </div>
          <div className="col text-right">
            <Link to="/user/networks">
              <Button color="primary" size="sm" > See all </Button>
            </Link>
          </div>
        </Row>
      </CardHeader>
      <Table className="align-items-center table-flush" responsive>
        <TableHeader headers={headers} />
        <NetworkSummaryRow networks={networks} />
      </Table>
    </Card>
  );
};
