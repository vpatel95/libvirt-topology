import { useState} from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {AuthAPI} from 'services/api';
import { SessionStore } from 'services/store';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location);

  const prevPath = location.state?.prevPath === true ? -2 : null;
  const from = prevPath || "/dashboard";

  const initialData = {
    username: '',
    password: '',
  };

  const [loginData, setLoginData] = useState(initialData);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setLoginData((prevalue) => {
      return {
        ...prevalue,
        [name]: value
      }
    })
  }

  function handleLogin(e) {
    e.preventDefault();

    const { username, password } = loginData;

    AuthAPI.login(username, password).then(res => {
      const accessToken = res?.data?.token;
      const user = res?.data?.user;
      SessionStore.setToken(accessToken);
      SessionStore.setUser(user);
      navigate(from, { replace: true});
    }, error => {
        const errMsg =
          (error?.response?.data?.message) ||
            error.message ||
            error.toString();
        // TODO: Mask the API error
        toast.error("Login error : " + errMsg);
        setLoginData(initialData);
    })
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                disabled
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("assets/img/icons/common/github.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                disabled
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign in with credentials</small>
            </div>
            <Form onSubmit={handleLogin}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupText>
                    <i className="ni ni-single-02" />
                  </InputGroupText>
                  <Input
                    name="username"
                    value={loginData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    type="text"
                    autoComplete="new-username"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                  <Input
                    name="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
