import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./Auth.css";
import logo from "../assets/img/logo-site2.png";
import Cookies from "universal-cookie";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const userEmail = useRef();
  const userPassword = useRef();
  const rememberUser = useRef();

  const authenticatesUser = async (event) => {
    event.preventDefault();
    const response = await authenticate();
    if (!response.ok) {
      console.log(response);
    } else {
      navigate("/dashboard", {
        state: {
          isAuthUser: cookies.get("jwt"),
        },
      });
    }
  };

  async function authenticate() {
    const authData = {
      email: userEmail.current.value,
      password: userPassword.current.value,
      rememberUser: rememberUser.current.checked,
    };

    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      body: JSON.stringify(authData),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    var response = await res.json();
    if (!response.ok) {
      return { isError: true, message: "Não foi possível efetuar login." };
    } else {
      if (!authData.rememberUser) {
        cookies.set("jwt", response.access_token);
      } else {
        cookies.set("jwt", response.access_token, { maxAge: 2592000 });
      }
      return response;
    }
  }

  // useEffect(() => {
  //   async function loader() {
  //     const authData = {
  //       email: userEmail.current.value,
  //       password: userPassword.current.value,
  //       rememberUser: rememberUser.current.checked,
  //     };

  //     const response = await fetch("http://localhost:8080/auth/login", {
  //       method: "POST",
  //       body: JSON.stringify(authData),
  //       mode: "cors",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     var jwt = response.json();
  //     console.log(jwt);
  //     if (!response.ok) {
  //       // return { isError: true, message: "Could not fetch events." };
  //       throw { message: "Could not fetch evetns." };
  //     } else {
  //       return response;
  //     }
  //   }
  //   loader();
  //   setAuthUser(false);
  // }, [authUser]);

  return (
    <div className="login-form-container">
      <Container>
        <img src={logo} alt="evidence-logo" />
        <Row>
          <Col lg="6">
            <Card>
              <Card.Body>
                <Form onSubmit={authenticatesUser}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      ref={userEmail}
                      placeholder="Enter email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                      type="password"
                      ref={userPassword}
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                      type="checkbox"
                      ref={rememberUser}
                      label="Lembrar login"
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ float: "right" }}
                  >
                    Enviar
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
