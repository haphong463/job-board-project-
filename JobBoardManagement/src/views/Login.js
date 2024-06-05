import React from "react";
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
} from "reactstrap";
import logo from "../assets/images/logos/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";

// Xác định schema yup cho form
const schema = yup.object().shape({
  username: yup.string().required("Email is required!"),
  password: yup.string().required("Password is required!"),
});

const Login = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  // Sử dụng react-hook-form với yup resolver
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

  // Xử lý khi submit form
  const onSubmit = (data) => {
    console.log(data);
    dispatch(login(data));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" style={{ width: "150px" }} />
          </div>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="username">username</Label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="username"
                    placeholder="enter your username..."
                    invalid={!!errors.email}
                    {...field}
                  />
                )}
              />
              {errors.email && (
                <FormFeedback>{errors.email.message}</FormFeedback>
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
                    placeholder="enter your password..."
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
            {authStatus === "failed" && <p>{authError}</p>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
