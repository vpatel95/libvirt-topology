import React from "react";
import {Button, Card, CardHeader, Table, Row} from "reactstrap";
import { TableHeader } from "./TableHeader";
import { getNetworkType } from "utils";
import {Link} from "react-router-dom";

export const NetworkTableRow = ({networks}) => {

  return (
    <tbody>
    {networks &&
      networks.map((network) => (
        <tr key={network.ID}>
          <th scope="row">{network.name}</th>
          <td>{getNetworkType(network.Type)}</td>
          <td>{network.subnet4}</td>
          <td>{network.has_v6 ? network.subnet6 : "N/A"}</td>
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
        <NetworkTableRow networks={networks} />
      </Table>
    </Card>
  );
};
