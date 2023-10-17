import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Dashboard() {
  return (
    <Container className="mt-3">
      <Row>
        <Col className="d-flex justify-center items-center">
          <span>Dashboard!</span>
        </Col>
      </Row>
    </Container>
  );
}
