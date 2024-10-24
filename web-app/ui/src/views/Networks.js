import { useState } from 'react';
import {
  Card,
  Container,
  Row,
} from 'reactstrap';
import {useLoaderData} from 'react-router-dom';

import { NetworkTable } from 'components/Tables';
import { UserAPI } from 'services/api';
import { SessionStore } from 'services/store';

const loader = async () => {
  const user = SessionStore.getUser();

  const data = await UserAPI.networks(user?.id)
    .then(response => {
      return { data: response?.data?.data };
    }, error => {
      return { error }
    });

  return data;
};

const Networks = () => {
  const { data } = useLoaderData();
  const [networks, setNetworks] = useState(data);

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row>
          <div className="col">
            <Card className="shadow mb-3">
              <NetworkTable
                headers={["S. No", "Name", "Type", "IPv4 Address", "IPv6 Address",
                          "Topology ID", "Delete", "View"]}
                networks={networks}
                setNetworks={setNetworks} />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export {
  Networks,
  loader
};
