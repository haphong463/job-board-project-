import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

const User = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };
  return (
    <Row>
      <Col lg={4} md={6} sm={12}>
        <Card>
          <CardBody className="text-center">
            <img
              alt="Avatar"
              src="https://picsum.photos/200"
              className="rounded-circle img-fluid"
              style={{ width: "150px", height: "150px" }}
            />
            <CardTitle tag="h5" className="mt-3">
              User Name
            </CardTitle>
            <CardText>
              This is a brief bio of the user. It can contain a short
              description or any other relevant information.
            </CardText>
          </CardBody>
        </Card>
      </Col>
      <Col lg={8} md={6} sm={12}>
        <Card className="p-4">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="bio">Bio</Label>
              <Input
                type="textarea"
                name="bio"
                id="bio"
                placeholder="Enter your bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FormGroup>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default User;
