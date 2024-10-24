import React from "react";
import {
  Card,
  Table,
} from "reactstrap";
import {NetworkDetailRow, NetworkSummaryRow} from "components/Networks";
import {TopologyDetailRow, TopologySummaryRow} from "components/Topologies";
import {VmDetailRow, VmSummaryRow} from "components/VirtualMachines";
import {CardHeaderWithButton} from "./Cards";

export const BaseTable = ({title, headers, row}) => {
  return (
    <Card className="shadow mb-3">
      {title}
      <Table className="align-items-center table-flush" responsive>
        <TableHeader headers={headers} />
        {row}
      </Table>
    </Card>
  );
};

export const TableHeader = ({headers}) => {
  return (
    <thead className="thead-light">
    <tr>
      {headers &&
        headers.map((column) => (
          <th key={column} scope="col">{column}</th>
        ))
      }
    </tr>
    </thead>
  );
};

export const TopologyTable = ({headers, topologies, summary}) => {

  var TopologyRow = summary ?
    <TopologySummaryRow topologies={topologies} /> :
    <TopologyDetailRow topologies={topologies} />;

  var TitleElement = summary ?
    <CardHeaderWithButton header={'Topologies'} label={'See All'} link={'/user/topologies'}/> :
    <CardHeaderWithButton header={'Topologies'} label={'Create'}
      link={'/user/topologies/create'} size={'md'} />;


  return (
    <BaseTable title={TitleElement} headers={headers} row={TopologyRow} />
  );
};

export const NetworkTable = ({headers, networks, summary}) => {

  var NetworkRow = summary ?
    <NetworkSummaryRow networks={networks} /> :
    <NetworkDetailRow networks={networks} />;

  var TitleElement = summary ?
    <CardHeaderWithButton header={'Networks'} label={'See All'} link={'/user/networks'}/> :
    <CardHeaderWithButton header={'Networks'} label={'Create'}
      link={'/user/networks/create'} size={'md'} />;

  return (
    <BaseTable title={TitleElement} headers={headers} row={NetworkRow} />
  );
};

export const VirtualMachineTable = ({headers, vms, summary}) => {

  var VmRow = summary ?
    <VmSummaryRow vms={vms} /> :
    <VmDetailRow vms={vms} />;

  var TitleElement = summary ?
    <CardHeaderWithButton header={'Virtual Machines'} label={'See All'}
      link={'/user/virtual-machines'}/> :
    <CardHeaderWithButton header={'Virtual Machines'} label={'Create'}
      link={'/user/virtual-machines/create'} size={'md'} />;

  return (
    <BaseTable title={TitleElement} headers={headers} row={VmRow} />
  );
};
