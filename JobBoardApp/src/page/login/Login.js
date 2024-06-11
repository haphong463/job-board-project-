import React, { useEffect, useState } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaCheck, FaTimes } from "react-icons/fa";
import { signUpSchema } from "../../utils/variables/schema";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetSignUpSuccess, signUp } from "../../features/authSlice";
import { useLoginForm } from "../../hooks/useLoginForm";

function SignUp(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const dispatch = useDispatch();
  const signUpSuccess = useSelector((state) => state.auth.signUpSuccess);
  const [password, setPassword] = useState("");

  const onSubmit = (data) => {
    console.log(data);
    dispatch(signUp(data));
    if (signUpSuccess) {
      console.log("DANG KY THANH CONG");
      // navigate("/");
    } else {
      console.log("DANG KY THAT BAI");
    }
  };

  const passwordValidations = [
    {
      test: password.length >= 6,
      message: "Password must be at least 6 characters",
    },
    {
      test: password.trim() !== "",
      message: "Password cannot be empty",
    },
  ];

 
}

export const Login = () => {
  const { register, handleSubmit, errors, onSubmit } = useLoginForm();
  const isVerified = useSelector((state) => state.auth.isVerified);

  return (
    <GlobalLayoutUser>
    <>
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
            <SignUp />
            <div className="col-lg-6">
              <h2 className="mb-4">Log In To JobBoard</h2>
              {!isVerified && <p>Not verified!</p>}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 border rounded"
              >
                {/* Form fields */}
                <div className="form-group">
                  <input
                    type="text"
                    id="loginEmail"
                    {...register("username")}
                    className="form-control"
                    placeholder="Email address"
                  />
                  <p className="text-danger">{errors.email?.message}</p>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    id="loginPassword"
                    {...register("password")}
                    className="form-control"
                    placeholder="Password"
                  />
                  <p className="text-danger">{errors.password?.message}</p>
                </div>
                <div className="form-group d-flex justify-content-between align-items-center">
                  <input
                    type="submit"
                    value="Log In"
                    className="btn px-4 btn-primary text-white"
                  />
                  <a href="/ForgotPassword" className="btn btn-link">
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  </GlobalLayoutUser>
  );
};
