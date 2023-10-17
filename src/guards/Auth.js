import { useLocation, Navigate } from "react-router-dom";

const AuthGuard = ({ isAuthUser, children }) => {
  const location = useLocation();

  if (!isAuthUser && (location.state == null || !location.state.isAuthUser)) {
    console.log("wtf");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthGuard;
