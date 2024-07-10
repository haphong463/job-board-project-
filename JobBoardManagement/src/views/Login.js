import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Alert,
} from "reactstrap";
import logo from "../assets/images/logos/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { login, signOut, updateUserAndRoles } from "../features/authSlice";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import showToast from "../utils/functions/showToast";
import nprogress from "nprogress";

// Xác định schema yup cho form
const schema = yup.object().shape({
  username: yup.string().required("Email is required!"),
  password: yup.string().required("Password is required!"),
});

const Login = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const messageError = useSelector((state) => state.auth.verificationMessage);
  const user = useSelector((state) => state.auth.user);
  const locationState = useSelector((state) => state.auth.location);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data) => {
    nprogress.start();
    dispatch(login(data))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (
            res.payload.roles.some(
              (item) => item === "ROLE_ADMIN" || item === "ROLE_MODERATOR"
            )
          ) {
            navigate("/jobportal");
          } else {
            showToast("You don't have access rights!", "error");
            dispatch(signOut());
          }
        }
      })
      .catch((err) => {
        console.error("Login failed:", err);
      })
      .finally(() => {
        nprogress.done();
      });
  };

  // if (
  //   user &&
  //   user.role.some(
  //     (role) =>
  //       role.authority === "ROLE_ADMIN" || role.authority === "ROLE_MODERATOR"
  //   )
  // ) {
  //   const redirectPath = locationState || "/jobportal";
  //   return <Navigate to={redirectPath} />;
  // }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" style={{ width: "150px" }} />
          </div>
          <h2 className="text-center mb-4">Login</h2>
          {messageError && <Alert color="danger">{messageError}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="username">Username</Label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="username"
                    placeholder="Enter your username..."
                    invalid={!!errors.username}
                    {...field}
                  />
                )}
              />
              {errors.username && (
                <FormFeedback>{errors.username.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter your password..."
                    invalid={!!errors.password}
                    {...field}
                  />
                )}
              />
              {errors.password && (
                <FormFeedback>{errors.password.message}</FormFeedback>
              )}
            </FormGroup>
            <FormGroup check className="mb-4">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Label check>
                    <Input type="checkbox" {...field} /> Remember me
                  </Label>
                )}
              />
            </FormGroup>
            <Button color="primary" block disabled={authStatus === "loading"}>
              {authStatus === "loading" ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
