import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosRequest from "../../configs/axiosConfig";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function ResetPassword() {
  const query = useQuery();
  const email = query.get("email");
  const token = query.get("token");
  const user = useSelector((state) => state.auth.user);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(false);
  console.log(">>>> email: ", email);
  // useEffect(() => {
  //   const verifyToken = async () => {
  //     try {
  //       const response = await axiosRequest.post('/auth/verify-reset-token', null, {
  //         params: { email, token }
  //       });
  //       if (response && response.data) {
  //         setMessage(response.data.message);
  //         if (response.data.message === "Token is valid.") {
  //           setRedirect(false);
  //         }
  //       }
  //     } catch (error) {
  //       if (error.response && error.response.data) {
  //         setMessage(error.response.data.message);
  //       } else {
  //         setMessage("An error occurred. Please try again.");
  //       }
  //     }
  //   };
  //   verifyToken();
  // }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      const response = await axiosRequest.post("/auth/set-new-password", null, {
        params: {
          email,
          token,
          newPassword,
          confirmPassword,
        },
      });
      if (response && response.data) {
        setMessage(response.data.message);
        if (response.data.message === "Password reset successfully!") {
          setRedirect(true);
          // Hiển thị thông báo thành công
          console.log("Password reset successfully!");
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };
  if (redirect) {
    return <Navigate to="/login" />;
  }
  if (user) return <Navigate to="/" replace={true} />;

  return (
    <GlobalLayoutUser>
      <section
        className="section-hero overlay inner-page bg-image"
        style={{
          backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
        }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Sign Up/Login</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>Log In</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h2 className="mb-4">Reset Password</h2>
              {message && (
                <p
                  className={
                    message.includes("successfully")
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {message}
                </p>
              )}
              <form onSubmit={handleSubmit} className="p-4 border rounded">
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    value="Submit"
                    className="btn px-4 btn-primary text-white"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
}
export default ResetPassword;
