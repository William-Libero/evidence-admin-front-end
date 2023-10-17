import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import "./css/ReadyToDeliveryBoards.css";
import { BiPencil } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { NavLink } from "react-router-dom";
import Cookies from "universal-cookie";
import Carousel from "react-material-ui-carousel";

const cookies = new Cookies();
const isAuthUser = cookies.get("jwt");

export default function ReadyToDeliveryBoards() {
  const [boards, setBoards] = useState([{ id: 0, img: [] }]);
  const [updateBoards, setUpdateBoards] = useState(false);
  const [formatBoardsImgs, setFormatBoardsImgs] = useState(null);

  useEffect(() => {
    const getAllBoards = async () => {
      const res = await fetch(
        "http://localhost:8080/readyToDeliveryBoards/boards",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthUser}`,
          },
        }
      );
      var response = await res.json();
      setBoards(response.boards);
      setUpdateBoards(false);
      setFormatBoardsImgs(true);
    };
    getAllBoards();
  }, [updateBoards]);

  useEffect(() => {
    if (boards.length >= 1 && formatBoardsImgs) {
      boards.forEach((board) => {
        var imgsArray = [];
        for (const [key, value] of Object.entries(board)) {
          if (key.includes("img") && value !== "" && value !== null) {
            imgsArray.push(value);
          }
        }
        board.img = imgsArray;
      });
      setBoards(boards);
      setFormatBoardsImgs(false);
    }
  }, [formatBoardsImgs]);

  const deleteBoard = async (event, boardId) => {
    event.preventDefault();
    const res = await fetch(
      `http://localhost:8080/readyToDeliveryBoards/deleteBoard/${boardId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isAuthUser}`,
        },
        mode: "cors",
      }
    );
    var response = await res.json();
    setUpdateBoards(true);
    return response;
  };

  return (
    <Container className="mt-3">
      <Row>
        <NavLink className="create-btn mb-6" to="/cadastrarPrancha">
          <MdAddCircleOutline /> Cadastrar prancha
        </NavLink>
      </Row>
      <Row>
        {boards.length >= 1 && (
          <Col className="d-flex justify-center items-center p-0">
            <ul>
              {boards.map((board, i) => {
                return (
                  <li key={i}>
                    <Card className="board-container">
                      <Card.Body className="w-full board-content">
                        {board.img != null && (
                          <Carousel autoPlay={false}>
                            {typeof board.img !== "string" &&
                              // eslint-disable-next-line array-callback-return
                              board.img.map((img, i) => {
                                if (img !== null) {
                                  return (
                                    <div key={i}>
                                      <img
                                        src={"data:image/png;base64," + img}
                                        alt="board"
                                        text="First slide"
                                      />
                                    </div>
                                  );
                                }
                              })}
                          </Carousel>
                        )}
                        <Card.Title style={{ textAlign: "center" }}>
                          {board.type}
                        </Card.Title>
                        <Card.Text>Tamanho: {board.size}</Card.Text>
                        <Card.Text>Largura: {board.width}</Card.Text>
                        <Card.Text>Flutuação: {board.fluctuation}</Card.Text>
                        <Card.Text>Volume: {board.volume}</Card.Text>
                        <Card.Text>Bloco: {board.block}</Card.Text>
                        <Row>
                          <Col
                            lg={6}
                            className="d-flex justify-center items-center"
                          >
                            <Card.Link
                              className="edit-btn"
                              href={"/editarPrancha/" + board.id}
                            >
                              <BiPencil /> Editar prancha
                            </Card.Link>
                          </Col>
                          <Col
                            lg={6}
                            className="d-flex justify-center items-center"
                          >
                            <Card.Link
                              className="delete-btn"
                              onClick={(event) => deleteBoard(event, board.id)}
                              href="/delete"
                            >
                              <FaTimes />
                              Excluir prancha
                            </Card.Link>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </Col>
        )}
      </Row>
    </Container>
  );
}
