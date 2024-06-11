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
import { Alert } from "reactstrap";
import { MdError, MdErrorOutline } from "react-icons/md";

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

  return (
    <div className="col-lg-6 mb-5">
      <h2 className="mb-4">Sign Up To JobBoard</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded">
        <div className="row form-group">
          <div className="col-md-12 mb-3 mb-md-0">
            <label className="text-black" htmlFor="firstName">
              First Name*
            </label>
            <input
              type="text"
              id="firstName"
              {...register("firstName")}
              className="form-control"
              placeholder="enter your first name..."
            />
            <p className="text-danger">{errors.firstName?.message}</p>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12 mb-3 mb-md-0">
            <label className="text-black" htmlFor="lastName">
              Last Name*
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName")}
              className="form-control"
              placeholder="enter your last name..."
            />
            <p className="text-danger">{errors.lastName?.message}</p>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12 mb-3 mb-md-0">
            <label className="text-black" htmlFor="username">
              Username*
            </label>
            <input
              type="text"
              id="username"
              {...register("username")}
              className="form-control"
              placeholder="enter your username..."
            />
            <p className="text-danger">{errors.username?.message}</p>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12 mb-3 mb-md-0">
            <label className="text-black" htmlFor="email">
              Email*
            </label>
            <input
              type="text"
              id="email"
              {...register("email")}
              className="form-control"
              placeholder="enter your email address..."
            />
            <p className="text-danger">{errors.email?.message}</p>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12 mb-3 mb-md-0">
            <label className="text-black" htmlFor="password">
              Password*
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="form-control"
              placeholder="enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ul className="password-requirements">
              {passwordValidations.map((validation, index) => (
                <li
                  key={index}
                  className={validation.test ? "valid" : "invalid"}
                >
                  {validation.test ? (
                    <FaCheck className="text-success" />
                  ) : (
                    <FaTimes className="text-danger" />
                  )}{" "}
                  {validation.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="row form-group mb-4">
          <div className="col-md-12 mb-3 mb-md-0">
            <label className="text-black" htmlFor="confirmPassword">
              Re-Type Password*
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className="form-control"
              placeholder="re-type password ..."
            />
            <p className="text-danger">{errors.confirmPassword?.message}</p>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12 mb-3 mb-md-0">
            <label className="text-black" htmlFor="gender">
              Gender*
            </label>
            <select
              id="gender"
              {...register("gender")}
              className="form-control"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <p className="text-danger">{errors.gender?.message}</p>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12">
            <input
              type="submit"
              value="Sign Up"
              className="btn px-4 btn-primary text-white"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export const Login = () => {
  const { register, handleSubmit, errors, onSubmit } = useLoginForm();
  const isVerified = useSelector((state) => state.auth.isVerified);
  const verificationEmail = useSelector(
    (state) => state.auth.verificationEmail
  );
  const verificationMessage = useSelector(
    (state) => state.auth.verificationMessage
  );

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
                {!isVerified && (
                  <Alert color="danger">
                    <MdErrorOutline size={25} className="mr-2" />
                    {verificationMessage}
                  </Alert>
                )}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-4 border rounded"
                >
                  {/* Form fields */}
                  <input
                    type="text"
                    id="loginEmail"
                    {...register("username")}
                    className="form-control"
                    placeholder="username..."
                  />
                  <p className="text-danger">{errors.username?.message}</p>
                  {/* More fields */}
                  <input
                    type="password"
                    id="loginPassword"
                    {...register("password")}
                    className="form-control"
                    placeholder="Password"
                  />
                  <p className="text-danger">{errors.password?.message}</p>
                  {/* Submit button */}
                  <input
                    type="submit"
                    value="Log In"
                    className="btn px-4 btn-primary text-white"
                  />
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    </GlobalLayoutUser>
  );
};
