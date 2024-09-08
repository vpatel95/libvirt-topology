import {useState} from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row
} from 'reactstrap';
import {useLoaderData} from "react-router-dom";

import {VmDetail} from "/src/components/VirtualMachines";
import {VmAPI} from "/src/services/api";

const loader = async ({params}) => {
  const data = await VmAPI.get(params.vmId)
    .then(response => {
      return { data: response?.data?.data };
    }, error => {
      return { error }
    });

  return data;
};

const VirtualMachine = () => {
  const {data} = useLoaderData();
  const [vm] = useState(data);

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">{vm.name} VM</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <VmDetail vm={vm} />
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
};

export {
  VirtualMachine,
  loader
}
