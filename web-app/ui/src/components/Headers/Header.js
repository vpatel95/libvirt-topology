import {Link} from "react-router-dom";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

export const HeaderCard = ({userObject}) => {
  return (
    <>
      <Card className="card-stats mb-4 mb-xl-0">
        <CardBody>
          <Row>
            <div className="col">
              <CardTitle tag="h5" className="text-uppercase text-muted mb-0" >
                <Link to={"/" + userObject.link} >{userObject.name}</Link>
              </CardTitle>
              <span className="h2 font-weight-bold mb-0">
                {userObject.size}
              </span>
            </div>
            <Col className="col-auto">
              <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                <i className="fa fa-laptop" />
              </div>
            </Col>
          </Row>
          <p className="mt-3 mb-0 text-muted text-sm">
            <span className="text-success mr-2">
              <i className="fa fa-arrow-up" /> 3.48%
            </span>{" "}
            <span className="text-nowrap">Since last month</span>
          </p>
        </CardBody>
      </Card>
    </>
  );
};

const Header = ({userObjects}) => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="4">
                <HeaderCard userObject={userObjects.topologies} />
              </Col>
              <Col lg="6" xl="4">
                <HeaderCard userObject={userObjects.networks} />
              </Col>
              <Col lg="6" xl="4">
                <HeaderCard userObject={userObjects.vms} />
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
