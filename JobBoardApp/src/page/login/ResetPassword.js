import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, Navigate } from "react-router-dom";
import axiosRequest from "../../configs/axiosConfig";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const schema = yup.object().shape({
  newPassword: yup.string().min(6, "Password must be at least 6 characters").required("New Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function ResetPassword() {
  const query = useQuery();
  const email = query.get("email");
  const token = query.get("token");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axiosRequest.post("/auth/set-new-password", null, {
        params: {
          email,
          token,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
      });
      if (response && response.data) {
        setMessage(response.data.message);
        if (response.data.message === "Password reset successfully!") {
          setRedirect(true);
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

  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        setRedirect(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [redirect]);

  if (redirect) {
    return <Navigate to="/login" />;
  }

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
              <h1 className="text-white font-weight-bold">Reset Password</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Reset Password</strong></span>
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
                <div className={message.includes("successfully") ? "alert alert-success" : "alert alert-danger"} role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded">
                <div className="form-group">
                  <label className="text-black" htmlFor="newPassword">New Password*</label>
                  <input
                    type="password"
                    id="newPassword"
                    {...register("newPassword")}
                    className="form-control"
                    placeholder="Enter your new password..."
                  />
                  <p className="text-danger">{errors.newPassword?.message}</p>
                </div>
                <div className="form-group">
                  <label className="text-black" htmlFor="confirmPassword">Confirm Password*</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    className="form-control"
                    placeholder="Confirm your new password..."
                  />
                  <p className="text-danger">{errors.confirmPassword?.message}</p>
                </div>
                <div className="form-group">
                  <input type="submit" value="Submit" className="btn px-4 btn-primary text-white w-100" />
                </div>
              </form>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-center" style={{ height: "auto" }}>
              <img src="https://itviec.com/assets/robby-login-df4a56395486b5cea97ba1754d226059626e6e124b3ea3db0789ba3c39f644f1.png" alt="Reset Password" />
            </div>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
}

export { ResetPassword };
