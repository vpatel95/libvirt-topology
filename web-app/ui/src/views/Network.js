import {useState} from "react";
import {useLoaderData} from "react-router-dom";
import {Card, CardBody, CardHeader, Container, Row} from "reactstrap";

import {NetworkDetail} from "components/Networks";
import {NetworkAPI} from "services/api";

const loader = async ({params}) => {
  let data = {};

  data.nw = await NetworkAPI.get(params.networkId)
    .then(response => {
      return  response?.data?.data;
    }, error => {
      return { error };
    });

  data.vms = await NetworkAPI.attachedVms(params.networkId)
    .then(response => {
      return response?.data?.data;
    }, error => {
      return { error };
    });

  return data;
};

const Network = () => {
  const { nw, vms } = useLoaderData();
  const [network] = useState(nw);
  const [attachedVms] = useState(vms);

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">{network?.name} Network</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <NetworkDetail network={network} attachedVms={attachedVms}/>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
};

export {
  Network,
  loader,
};
