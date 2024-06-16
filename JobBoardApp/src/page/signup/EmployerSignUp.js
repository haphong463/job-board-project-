import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signUpSchema } from "../../utils/variables/schema";
import { signUp } from "../../features/authSlice";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import registerImage from "../../assets/images/register.png";
import "./sign_up.css";
import { NavLink } from "react-router-dom";

const employerSignUpSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  gender: yup.string().required("Gender is required"),
  companyName: yup.string().required("Company name is required"),
  companyAddress: yup.string().required("Company address is required"),
  companyWebsite: yup.string().url("Invalid URL format").required("Company website is required")
});

function EmployerSignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(employerSignUpSchema),
  });
  const dispatch = useDispatch();
  const signUpSuccess = useSelector((state) => state.auth.signUpSuccess);
  const [password, setPassword] = useState("");
  const onSubmit = async (data) => {
    data.role = ["employer"];
    dispatch(signUp(data));
    console.log("check sign up state: ", signUpSuccess);
    if (signUpSuccess) {
      console.log("DANG KY THANH CONG");
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
                  <strong>Sign up</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-5">
              <h2 className="mb-4">Register an employer account</h2>
              {signUpSuccess && (
                <div className="alert alert-success" role="alert">
                  Successfully signed up! Verify your account via email.
                </div>
              )}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 border rounded"
              >
                <div className="row form-group">
                  <div className="col-md-6 mb-3 mb-md-0">
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
                  <div className="col-md-6 mb-3 mb-md-0">
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
                      Email Works*
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
                    <p className="text-danger">
                      {errors.confirmPassword?.message}
                    </p>
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
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="companyName">
                      Company Name*
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      {...register("companyName")}
                      className="form-control"
                      placeholder="enter your company name..."
                    />
                    <p className="text-danger">{errors.companyName?.message}</p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="companyAddress">
                      Company Address*
                    </label>
                    <input
                      type="text"
                      id="companyAddress"
                      {...register("companyAddress")}
                      className="form-control"
                      placeholder="enter your company address..."
                    />
                    <p className="text-danger">{errors.companyAddress?.message}</p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="companyWebsite">
                      Company Website*
                    </label>
                    <input
                      type="text"
                      id="companyWebsite"
                      {...register("companyWebsite")}
                      className="form-control"
                      placeholder="enter your company website..."
                    />
                    <p className="text-danger">{errors.companyWebsite?.message}</p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <button
                      type="submit"
                      className="btn px-4 btn-primary text-white"
                    >
                      Register as Employer
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-6">
              <img
                src={registerImage}
                alt="Register"
                className="img-fluid d-block mx-auto"
              />
            </div>
          </div>
          <div className="mt-5 text-center">
            <p>Already have an account? <NavLink to="/sign-in">Sign In</NavLink></p>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
}

export default EmployerSignUp;
