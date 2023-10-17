import Nav from "react-bootstrap/Nav";
import logo from "../assets/img/logo-site2.png";
import "./css/DashboardLayout.css";
import { BsGrid1X2Fill, BsSpeedometer } from "react-icons/bs";
import { BiExit } from "react-icons/bi";
import Cookies from "universal-cookie";
import { useNavigate, NavLink, Outlet } from "react-router-dom";

const cookies = new Cookies();

export default function DashboardLayout() {
  const navigate = useNavigate();

  const logOut = () => {
    cookies.remove("jwt");
    navigate("/", {
      state: {
        isAuthUser: cookies.get("jwt"),
      },
    });
  };

  return (
    <main>
      <Nav className="sidebar" activeKey="/dashboard">
        <div>
          <Nav.Item>
            <NavLink className="logoLink" to="/dashboard">
              <img src={logo} className="evidence-logo" alt="evidence-logo" />
            </NavLink>
          </Nav.Item>
          <div className="sidebar-sticky"></div>
          <Nav.Item>
            <NavLink className="sidebar-link" to="/dashboard">
              <BsGrid1X2Fill />
              Dashboard
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink className="sidebar-link" to="/prontaEntrega">
              <BsSpeedometer />
              Pronta entrega
            </NavLink>
          </Nav.Item>
        </div>
        <Nav.Item className="container-logout-btn">
          <NavLink className="sidebar-logout-btn" onClick={logOut}>
            <BiExit />
            Sair
            <span> </span>
          </NavLink>
        </Nav.Item>
      </Nav>
      <div className="outlet-container">
        <Outlet />
      </div>
    </main>
  );
}
