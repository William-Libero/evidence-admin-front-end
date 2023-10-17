import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "universal-cookie";
import { MuiFileInput } from "mui-file-input";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Card from "react-bootstrap/Card";
import "./css/CreateBoard.css";

const cookies = new Cookies();
const isAuthUser = cookies.get("jwt");

export default function CreateBoard() {
  const [boardType, setBoardType] = useState("");
  const [boardTypeValidate, setBoardTypeValidate] = useState("");
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
  const [boardImg, setBoardImg] = useState(null);
  const [boardImgValidate, setBoardImgValidate] = useState("");

  const [openUpdatedBoardSuccessMessage, setOpenUpdatedBoardSuccessMessage] =
    useState(false);
  const [
    openBoardImgAmountExceededLimitMessage,
    setOpenBoardImgAmountExceededLimitMessage,
  ] = useState(false);

  const [snackSuccessMessage, setSnackSuccessMessage] = useState("");
  const [snackErrorMessage, setSnackErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseUpdatedBoardSuccessMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenUpdatedBoardSuccessMessage(false);
  };

  const handleBoardImgChange = (newBoardImg) => {
    setBoardImg(newBoardImg);
  };

  const handleChange = (value) => {
    setBoardType(value);
  };

  const changeValue = (event, valueType) => {
    if (valueType === "img" && event.length > 8) {
      setOpenBoardImgAmountExceededLimitMessage(true);
      setSnackErrorMessage("Limite de imagens excedido, tente novamente.");
      setBoardImgValidate(false);
      return false;
    }
    validateForm(event, valueType);
  };

  const validateForm = (event, valueType) => {
    if (valueType !== "img") {
      event = typeof event === "object" ? event.target.value : event;
    }

    switch (valueType) {
      case "img":
        if (event !== "" && event !== null && event !== []) {
          handleBoardImgChange(event);
          setBoardImgValidate(true);
        } else {
          setBoardImgValidate(false);
        }
        break;

      case "type":
        if (event !== "" && event !== undefined) {
          console.log(event);
          handleChange(event);
          setBoardTypeValidate(true);
        } else {
          setBoardTypeValidate(false);
        }
        break;

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
      type: boardType,
      size: boardSize,
      width: boardWidth,
      fluctuation: boardFluctuation,
      volume: boardVolume,
      block: boardBlock,
    };
    var result = Object.entries(boardData);

    result.forEach((data) => {
      if (data[1] === "" || data[1] === undefined || data[1] === null) {
        console.log(data[1], data[0]);
        validateForm(data[1], data[0]);
        isFormValidated = false;
      }
    });

    isFormValidated && createNewBoard(boardData);
  };

  const createNewBoard = async (boardData) => {
    const res = await fetch(
      "https://evidence-admin-8511888fbf4d.herokuapp.com/readyToDeliveryBoards/addBoard",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isAuthUser}`,
        },
        mode: "cors",
        body: JSON.stringify(boardData),
      }
    );
    var insertedBoard = await res.json();
    if (boardImg != null) {
      await uploadCreatedBoardImgs(boardImg, insertedBoard.board[0].id);
    } else {
      setLoading(false);
      setOpenUpdatedBoardSuccessMessage(true);
      setSnackSuccessMessage("Prancha criada com sucesso!");
    }
  };

  const uploadCreatedBoardImgs = async (boardImg, insertedBoardId) => {
    var formDataImages = new FormData();
    boardImg.forEach((img, i) => {
      formDataImages.append("files", img);
    });

    const res = await fetch(
      "https://evidence-admin-8511888fbf4d.herokuapp.com/readyToDeliveryBoards/uploadCreatedBoardImgs/" +
        insertedBoardId,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${isAuthUser}`,
        },
        mode: "cors",
        body: formDataImages,
      }
    );
    var response = await res.json();
    console.log(response);
    setLoading(false);
    setOpenUpdatedBoardSuccessMessage(true);
    setSnackSuccessMessage("Prancha criada com sucesso!");
    setBoardImg(null);
  };

  const goToProntaEntrega = () => {
    navigate("/prontaEntrega");
  };

  const handleBoardImgAmountExceededLimitMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenBoardImgAmountExceededLimitMessage(false);
  };

  return (
    <Container className="mt-3">
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
      {loading && (
        <div className="dialog-loader">
          <Box className="dialog-loader-container" sx={{ width: "100%" }}>
            <LinearProgress style={{ width: "100" }} />
            Carregando
          </Box>
        </div>
      )}
      {!loading && (
        <div style={{ marginBottom: "40px" }}>
          <Button onClick={goToProntaEntrega} variant="contained" color="grey">
            Voltar
          </Button>
        </div>
      )}
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
      {!loading && (
        <Row className="justify-content-md-center">
          <Col lg="6">
            <h3 className="mb-3">Cadastrar prancha</h3>
            <FormControl className="mb-3" fullWidth={true}>
              <MuiFileInput
                multiple
                error={boardImgValidate === false}
                helperText={
                  boardImgValidate === false && "Imagem é obrigatória"
                }
                value={boardImg}
                onChange={(e) => changeValue(e, "img")}
                label="Imagens (Máximo: 8)"
              />
            </FormControl>
            <FormControl className="mb-3" fullWidth={true}>
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                labelId="demo-simple-select-error-label"
                label={boardTypeValidate && "demo-simple-select-error-label"}
                id="demo-simple-select-error"
                value={boardType}
                onChange={(e) => changeValue(e, "type")}
              >
                <MenuItem value={"Shortboard"}>Shortboard</MenuItem>
                <MenuItem value={"Longboard"}>Longboard</MenuItem>
                <MenuItem value={"Funboard"}>Funboard</MenuItem>
                <MenuItem value={"Mini Tank"}>Mini Tank</MenuItem>
                <MenuItem value={"Fish"}>Fish</MenuItem>
                <MenuItem value={"Mid"}>Mid</MenuItem>
                <MenuItem value={"Mini Long"}>Mini Long</MenuItem>
                <MenuItem value={"Stand Up"}>Stand Up</MenuItem>
              </Select>
              {boardTypeValidate === false && (
                <FormHelperText error={true}>Tipo é obrigatório</FormHelperText>
              )}
            </FormControl>
            <FormControl className="mb-3" fullWidth={true}>
              <TextField
                id="outlined-basic"
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
                id="outlined-basic"
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
                id="outlined-basic"
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
                id="outlined-basic"
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
                id="outlined-basic"
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
                Cadastrar
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
  );
}
