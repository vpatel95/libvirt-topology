/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
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
                <Link to={"/user/" + userObject.link} >{userObject.name}</Link>
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
              <Col lg="6" xl="3">
                <HeaderCard userObject={userObjects.topologies} />
              </Col>
              <Col lg="6" xl="3">
                <HeaderCard userObject={userObjects.networks} />
              </Col>
              <Col lg="6" xl="3">
                <HeaderCard userObject={userObjects.vms} />
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Performance
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">49,65%</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
