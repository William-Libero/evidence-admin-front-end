import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/UpdateBoard.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";
import { MuiFileInput } from "mui-file-input";

import Carousel from "react-material-ui-carousel";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    grey: {
      main: "#f8f9fa",
    },
  },
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const cookies = new Cookies();
const isAuthUser = cookies.get("jwt");

export default function UpdateBoard() {
  var { boardId } = useParams();
  const [updateCurrentBoard, setUpdateCurrentBoard] = useState();
  const [boardImgs, setBoardImgs] = useState();
  const [boardType, setBoardType] = useState("");
  const [boardSize, setBoardSize] = useState("");
  const [boardSizeValidate, setBoardSizeValidate] = useState("");
  const [boardWidth, setBoardWidth] = useState("");
  const [boardWidthValidate, setBoardWidthValidate] = useState("");
  const [boardFluctuation, setBoardFluctuation] = useState("");
  const [boardFluctuationValidate, setBoardFluctuationValidate] = useState("");
  const [boardVolume, setBoardVolume] = useState("");
  const [boardVolumeValidate, setBoardVolumeValidate] = useState("");
  const [boardBlock, setBoardBlock] = useState("");
  const [boardBlockValidate, setBoardBlockValidate] = useState("");

  const [updatedBoardImgs, setUpdatedBoardImgs] = useState(null);
  const [boardImgValidate, setBoardImgValidate] = useState("");

  const [openUpdatedBoardSuccessMessage, setOpenUpdatedBoardSuccessMessage] =
    useState(false);
  const [openUpdatedBoardErrorMessage, setOpenUpdatedBoardErrorMessage] =
    useState(false);
  const [
    openBoardImgAmountExceededLimitMessage,
    setOpenBoardImgAmountExceededLimitMessage,
  ] = useState(false);

  const [snackSuccessMessage, setSnackSuccessMessage] = useState("");
  const [snackErrorMessage, setSnackErrorMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await fetch(
          "https://evidence-admin-8511888fbf4d.herokuapp.com/readyToDeliveryBoards/board/" +
            boardId,
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
        setFormBoardValues(response.board[0]);
        validateAndSetBoardImgs(response.board);
        setLoading(false);
      } catch (e) {
        setOpenUpdatedBoardErrorMessage(true);
        setSnackErrorMessage(
          "Não foi possível recuperar dados para atualização da prancha."
        );
      }
    };

    getBoard();
  }, [boardId, updateCurrentBoard]);

  const validateAndSetBoardImgs = (board) => {
    if (board !== undefined) {
      var imgsArray = [];

      for (const [key, value] of Object.entries(board[0])) {
        if (
          key.includes("img") &&
          value !== "" &&
          value !== null &&
          value !== "null"
        ) {
          imgsArray.push(value);
        }
      }
      setBoardImgs(imgsArray);
    }
  };

  const setFormBoardValues = (board) => {
    setBoardType(board.type);
    setBoardSize(board.size);
    setBoardWidth(board.width);
    setBoardFluctuation(board.fluctuation);
    setBoardVolume(board.volume);
    setBoardBlock(board.block);
  };

  const handleChange = (event) => {
    setBoardType(event.target.value);
  };

  const updateBoardImg = (event, index) => {
    if (event.length > 8) {
      setOpenBoardImgAmountExceededLimitMessage(true);
      setSnackErrorMessage("Limite de imagens excedido, tente novamente.");
      setUpdatedBoardImgs(null);
      setBoardImgValidate(false);
    } else {
      if (event !== "" && event !== null && event !== []) {
        setUpdatedBoardImgs(event);
        setBoardImgValidate(true);
      } else {
        setBoardImgValidate(false);
      }
    }
  };

  const changeValue = (event, valueType) => {
    validateForm(event, valueType);
  };

  const validateForm = (event, valueType) => {
    event = typeof event === "object" ? event.target.value : event;

    switch (valueType) {
      case "size":
        if (event !== "" && event !== undefined) {
          setBoardSize(event);
          setBoardSizeValidate(true);
        } else {
          setBoardSize(event === undefined ? "" : event);
          setBoardSizeValidate(false);
        }
        break;

      case "width":
        if (event !== "" && event !== undefined) {
          setBoardWidth(event);
          setBoardWidthValidate(true);
        } else {
          setBoardWidth(event === undefined ? "" : event);
          setBoardWidthValidate(false);
        }
        break;

      case "fluctuation":
        if (event !== "" && event !== undefined) {
          setBoardFluctuation(event);
          setBoardFluctuationValidate(true);
        } else {
          setBoardFluctuation(event === undefined ? "" : event);
          setBoardFluctuationValidate(false);
        }
        break;

      case "volume":
        if (event !== "" && event !== undefined) {
          setBoardVolume(event);
          setBoardVolumeValidate(true);
        } else {
          setBoardVolume(event === undefined ? "" : event);
          setBoardVolumeValidate(false);
        }
        break;

      case "block":
        if (event !== "" && event !== undefined) {
          setBoardBlock(event);
          setBoardBlockValidate(true);
        } else {
          setBoardBlock(event === undefined ? "" : event);
          setBoardBlockValidate(false);
        }
        break;

      default:
        break;
    }
  };

  const submitForm = () => {
    setLoading(true);

    var isFormValidated = true;
    const boardData = {
      id: boardId,
      type: boardType,
      size: boardSize,
      width: boardWidth,
      fluctuation: boardFluctuation,
      volume: boardVolume,
      block: boardBlock,
    };
    var result = Object.entries(boardData);
    result.forEach((data) => {
      if (data[1] === "" || data[1] === undefined) {
        validateForm(data[1], data[0]);
        isFormValidated = false;
      }
    });

    isFormValidated && updateBoard(boardData);
  };

  const updateBoard = async (boardData) => {
    try {
      const res = await fetch(
        "http://localhost:8080/readyToDeliveryBoards/editBoard",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthUser}`,
          },
          mode: "cors",
          body: JSON.stringify(boardData),
        }
      );

      await res.json();

      if (updatedBoardImgs != null && updatedBoardImgs.length > 0) {
        await uploadCreatedBoardImgs(boardId);
      } else {
        setLoading(false);
        setOpenUpdatedBoardSuccessMessage(true);
        setSnackSuccessMessage("Dados atualizados com sucesso!");
      }
    } catch (e) {
      setOpenUpdatedBoardErrorMessage(true);
      setSnackErrorMessage("Não foi possível alterar dados da prancha.");
    }
  };

  const uploadCreatedBoardImgs = async (updatedBoardId) => {
    try {
      var formDataImages = new FormData();
      updatedBoardImgs.forEach((img, i) => {
        formDataImages.append("files", img);
      });

      const res = await fetch(
        "https://evidence-admin-8511888fbf4d.herokuapp.com/readyToDeliveryBoards/uploadCreatedBoardImgs/" +
          updatedBoardId,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${isAuthUser}`,
          },
          mode: "cors",
          body: formDataImages,
        }
      );
      if (await res.json()) {
        setTimeout(() => {
          setUpdateCurrentBoard(!updateCurrentBoard);
          setOpenUpdatedBoardSuccessMessage(true);
          setSnackSuccessMessage("Dados atualizados com sucesso!");
        }, 5000);
      }
    } catch (e) {
      setOpenUpdatedBoardErrorMessage(true);
      setSnackErrorMessage("Não foi possível alterar imagens da prancha.");
    }
  };

  const goToProntaEntrega = () => {
    navigate("/prontaEntrega");
  };

  const handleCloseUpdatedBoardSuccessMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenUpdatedBoardSuccessMessage(false);
  };

  const handleCloseUpdatedBoardErrorMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenUpdatedBoardErrorMessage(false);
  };

  const handleBoardImgAmountExceededLimitMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenBoardImgAmountExceededLimitMessage(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={openUpdatedBoardSuccessMessage}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseUpdatedBoardSuccessMessage}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackSuccessMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openUpdatedBoardErrorMessage}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseUpdatedBoardErrorMessage}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackErrorMessage}
          <br />
          Entre em contato com o{" "}
          <a
            target="_blank"
            className="suport-link"
            href="https://wa.me/5513982079615?text=Ol%C3%A1%2C+estou+com+problema+no+dashboard+de+administrador+do+site+Evidence+Surfboards."
            rel="noreferrer"
          >
            Suporte
          </a>
          .
        </Alert>
      </Snackbar>
      <Snackbar
        open={openBoardImgAmountExceededLimitMessage}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleBoardImgAmountExceededLimitMessage}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {snackErrorMessage}
        </Alert>
      </Snackbar>
      <Container className="updateBoardContainer mt-3" fluid>
        {!loading && (
          <div style={{ marginBottom: "40px" }}>
            <Button
              onClick={goToProntaEntrega}
              variant="contained"
              color="grey"
            >
              Voltar
            </Button>
          </div>
        )}
        {loading && (
          <div className="dialog-loader">
            <Box className="dialog-loader-container" sx={{ width: "100%" }}>
              <LinearProgress style={{ width: "100" }} />
              Carregando
            </Box>
          </div>
        )}
        {!loading && (
          <Row className="justify-content-md-center">
            <Col lg="6">
              <h3 className="mb-3">Editar prancha</h3>
              <MuiFileInput
                style={{ marginBottom: "20px", width: "100%" }}
                multiple
                error={boardImgValidate === false}
                helperText={
                  boardImgValidate === false && "Imagem é obrigatória"
                }
                value={updatedBoardImgs}
                onChange={(e) => updateBoardImg(e, "img")}
                label="Imagens (Máximo: 8)"
              />
              <FormControl className="mb-3" fullWidth={true}>
                <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                <Select value={boardType} onChange={handleChange}>
                  <MenuItem value={"Shortboard"}>Shortboard</MenuItem>
                  <MenuItem value={"Longboard"}>Longboard</MenuItem>
                  <MenuItem value={"Funboard"}>Funboard</MenuItem>
                  <MenuItem value={"Mini Tank"}>Mini Tank</MenuItem>
                  <MenuItem value={"Fish"}>Fish</MenuItem>
                  <MenuItem value={"Mid"}>Mid</MenuItem>
                  <MenuItem value={"Mini Long"}>Mini Long</MenuItem>
                  <MenuItem value={"Stand Up"}>Stand Up</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="mb-3" fullWidth={true}>
                <TextField
                  id="outlined-controlled"
                  value={boardSize}
                  error={boardSizeValidate === false}
                  helperText={
                    boardSizeValidate === false && "Tamanho é obrigatório"
                  }
                  label="Tamanho"
                  onChange={(e) => changeValue(e, "size")}
                />
              </FormControl>
              <FormControl className="mb-3" fullWidth={true}>
                <TextField
                  id="outlined-controlled"
                  value={boardWidth}
                  error={boardWidthValidate === false}
                  helperText={
                    boardWidthValidate === false && "Largura é obrigatório"
                  }
                  label="Largura"
                  onChange={(e) => changeValue(e, "width")}
                />
              </FormControl>
              <FormControl className="mb-3" fullWidth={true}>
                <TextField
                  id="outlined-controlled"
                  value={boardFluctuation}
                  error={boardFluctuationValidate === false}
                  helperText={
                    boardFluctuationValidate === false &&
                    "Flutuação é obrigatório"
                  }
                  label="Flutuação"
                  onChange={(e) => changeValue(e, "fluctuation")}
                />
              </FormControl>
              <FormControl className="mb-3" fullWidth={true}>
                <TextField
                  id="outlined-controlled"
                  value={boardVolume}
                  error={boardVolumeValidate === false}
                  helperText={
                    boardVolumeValidate === false && "Volume é obrigatório"
                  }
                  label="Volume"
                  onChange={(e) => changeValue(e, "volume")}
                />
              </FormControl>
              <FormControl className="mb-3" fullWidth={true}>
                <TextField
                  id="outlined-controlled"
                  value={boardBlock}
                  error={boardBlockValidate === false}
                  helperText={
                    boardBlockValidate === false && "Bloco é obrigatório"
                  }
                  label="Bloco"
                  onChange={(e) => changeValue(e, "block")}
                />
              </FormControl>
              <Col lg={12} className="d-flex justify-end">
                <Button onClick={submitForm} variant="contained">
                  Editar
                </Button>
              </Col>
            </Col>
            <Col
              className="flex justify-content-md-center align-items-center"
              lg="1"
            >
              <span style={{ fontWeight: "500", fontSize: "4em" }}>=</span>
            </Col>
            <Col lg="5">
              <Card className="board-container">
                <Card.Body className="w-full board-content">
                  <Carousel autoPlay={false}>
                    {boardImgs !== undefined &&
                      boardImgs.length > 0 &&
                      // eslint-disable-next-line array-callback-return
                      boardImgs.map((img, i) => {
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
                  <Card.Title style={{ textAlign: "center" }}>
                    {boardType}
                  </Card.Title>
                  <Card.Text>Tamanho: {boardSize}</Card.Text>
                  <Card.Text>Largura: {boardWidth}</Card.Text>
                  <Card.Text>Flutuação: {boardFluctuation}</Card.Text>
                  <Card.Text>Volume: {boardVolume}</Card.Text>
                  <Card.Text>Bloco: {boardBlock}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </ThemeProvider>
  );
}
