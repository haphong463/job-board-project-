import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  logout,
  setLocationState,
  updateUserAndRoles,
} from "../features/authSlice";
const FullLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isSignIn = useSelector((state) => state.auth.signInSuccess);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    dispatch(setLocationState(location.pathname));
    if (!user) {
      dispatch(updateUserAndRoles());
    }
  }, [location, dispatch, user]);
  useEffect(() => {
    if (user) {
      const refreshAuthToken = () => {
        const expiresIn = user?.exp || 0;
        const nowInSeconds = Math.floor(Date.now() / 1000);
        const remainingTime = expiresIn - nowInSeconds;
        const refreshTime = Math.max(0, remainingTime - 5);

        // Hiển thị số giây còn lại trong console.log

        const refreshTokenTimeout = setTimeout(() => {
          dispatch(logout());
          navigate("/jobportal/login");
          console.log("Token expired");
        }, refreshTime * 1000);

        return () => {
          clearTimeout(refreshTokenTimeout);
        };
      };
      const refreshTokenTimeout = refreshAuthToken();

      return () => clearTimeout(refreshTokenTimeout);
    } else {
      dispatch(updateUserAndRoles());
    }
  }, [user, dispatch]);

  if (!isSignIn && !user) {
    return <Navigate to="/jobportal/login" />;
  }

  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>

        <div className="contentArea">
          <Header />
          <Container className="p-4 wrapper" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
