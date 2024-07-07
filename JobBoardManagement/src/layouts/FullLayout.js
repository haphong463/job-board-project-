import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  getUserByIDThunk,
  logout,
  setLocationState,
  signOut,
  updateRoles,
  updateToken,
  updateUserAndRoles,
} from "../features/authSlice";
import "nprogress/nprogress.css"; // Import the CSS file
import { fetchBlogs } from "../features/blogSlice";
import { fetchBlogCategory } from "../features/blogCategorySlice";
import showToast from "../utils/functions/showToast";
import axiosRequest from "../configs/axiosConfig";
import axios from "axios";
const FullLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const roles = useSelector((state) => state.auth.roles);
  const blogStatus = useSelector((state) => state.blogs.status);
  const categoryStatus = useSelector((state) => state.blogCategory.status);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    dispatch(setLocationState(location.pathname));
  }, [location, dispatch]);

  useEffect(() => {
    console.log("---------REFRESH TOKEN---------");
    console.log(">>>user: ", user);

    const refreshAuthToken = (user, dispatch, navigate) => {
      const expiresIn = user?.exp || 0;
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const remainingTime = expiresIn - nowInSeconds;
      const refreshTime = Math.max(0, remainingTime - 5);

      const refreshTokenTimeout = setTimeout(async () => {
        try {
          const refreshToken = localStorage.getItem("refreshToken");

          if (refreshToken) {
            console.log(">>>user: ", user);
            const response = await axios.post(
              "http://localhost:8080/api/auth/refreshtoken",
              {
                refreshToken,
              }
            );

            if (response.status === 200) {
              const newAccessToken = response.data.accessToken;

              dispatch(updateToken(newAccessToken));
            }
          }
        } catch (error) {
          const status = error.response.status;
          console.log(">>>status: ", status);
          if (status === 403) {
            showToast(
              "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!",
              "error"
            );
          }
          dispatch(signOut());
          navigate("/jobportal/login");
        }
      }, refreshTime * 1000);

      return () => {
        clearTimeout(refreshTokenTimeout);
      };
    };

    if (user) {
      refreshAuthToken(user, dispatch, navigate);
    }
  }, [dispatch, localStorage.getItem("accessToken")]);

  useEffect(() => {
    // if (blogStatus === "idle" || categoryStatus === "idle") {

    console.log(">>> user: ", user);

    const fetchData = async () => {
      try {
        await Promise.all([
          // dispatch(fetchBlogs()).unwrap(),
          dispatch(fetchBlogCategory()).unwrap(),
          dispatch(getUserByIDThunk(user.sub)).unwrap(),
        ]);
        showToast("The data has been loaded successfully.");
      } catch (error) {
        showToast("Error loading data.", "error");
      }
    };

    fetchData();

    // }
  }, []);

  if (!user) {
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
