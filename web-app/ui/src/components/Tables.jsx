import React from "react";
import {
  Card,
  Table,
} from "reactstrap";
import {NetworkDetailRow, NetworkSummaryRow} from "/src/components/Networks";
import {TopologyDetailRow, TopologySummaryRow} from "/src/components/Topologies";
import {VmDetailRow, VmSummaryRow} from "/src/components/VirtualMachines";
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

export const TopologyTable = (props) => {

  const {headers, topologies, setTopologies, summary} = props;

  var TopologyRow = summary ?
    <TopologySummaryRow topologies={topologies} /> :
    <TopologyDetailRow topologies={topologies} setTopologies={setTopologies} />;

  var TitleElement = summary ?
    <CardHeaderWithButton header={'Topologies'} label={'See All'} link={'/topologies'}/> :
    <CardHeaderWithButton header={'Topologies'} label={'Create'}
      link={'/topologies/create'} size={'md'} />;


  return (
    <BaseTable title={TitleElement} headers={headers} row={TopologyRow} />
  );
};

export const NetworkTable = (props) => {

  const {headers, networks, setNetworks, summary} = props;

  var NetworkRow = summary ?
    <NetworkSummaryRow networks={networks} /> :
    <NetworkDetailRow networks={networks} setNetworks={setNetworks} />;

  var TitleElement = summary ?
    <CardHeaderWithButton header={'Networks'} label={'See All'} link={'/networks'}/> :
    <CardHeaderWithButton header={'Networks'} label={'Create'}
      link={'/networks/create'} size={'md'} />;

  return (
    <BaseTable title={TitleElement} headers={headers} row={NetworkRow} />
  );
};

export const VirtualMachineTable = (props) => {

  const {headers, vms, setVms, summary} = props;

  var VmRow = summary ?
    <VmSummaryRow vms={vms} /> :
    <VmDetailRow vms={vms} setVms={setVms} />;

  var TitleElement = summary ?
    <CardHeaderWithButton header={'Virtual Machines'} label={'See All'}
      link={'/virtual-machines'}/> :
    <CardHeaderWithButton header={'Virtual Machines'} label={'Create'}
      link={'/virtual-machines/create'} size={'md'} />;

  return (
    <BaseTable title={TitleElement} headers={headers} row={VmRow} />
  );
};
