import React, {useState} from 'react';
import {
  Container,
  Row,
} from 'reactstrap';
import {useLoaderData} from 'react-router-dom';

import {TopologyTable} from '/src/components/Tables';
import {UserAPI} from '/src/services/api';
import {SessionStore} from '/src/services/store';

const loader = async () => {
  const user = SessionStore.getUser();

  const data = await UserAPI.topologies(user?.id)
    .then(response => {
      return { data: response?.data?.data };
    }, error => {
      return { error };
    });

  return data;
};

const Topologies = () => {
  const { data } = useLoaderData();
  const [topologies, setTopologies] = useState(data);

  return (
    <>
      <Container className="pt-md-8" fluid>
        <Row>
          <div className="col">
            <TopologyTable
              headers={["S. No", "Name", "Networks", "Virtual Machines",
                "Edit", "Delete", "View"]}
              topologies={topologies}
              setTopologies={setTopologies} />
          </div>
        </Row>
      </Container>
    </>
  );
};

export {
  Topologies,
  loader
};
