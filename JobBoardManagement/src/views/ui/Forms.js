import React from "react";
import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define the validation schema using yup
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  category: yup.string().required("Category is required"),
  tags: yup.string().required("Tags are required"),
  image: yup.mixed().required("Image must be at least 1."),
});

const Forms = () => {
  // Use useForm hook from react-hook-form with yupResolver
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      tags: "",
      content: "",
      category: "",
      image: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Row>
      <Col>
        {/* --------------------------------------------------------------------------------*/}
        {/* Card for Blog Post Form*/}
        {/* --------------------------------------------------------------------------------*/}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-pencil me-2"> </i>
            Create Blog Post
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label for="postTitle">Title</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="postTitle"
                      placeholder="Enter the title of the blog post"
                      type="text"
                      invalid={!!errors.title}
                    />
                  )}
                />
                {errors.title && (
                  <FormText color="danger">{errors.title.message}</FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="postContent">Content</Label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="postContent"
                      placeholder="Write your blog content here"
                      type="textarea"
                      invalid={!!errors.content}
                    />
                  )}
                />
                {errors.content && (
                  <FormText color="danger">{errors.content.message}</FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="postCategory">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="postCategory"
                      type="select"
                      invalid={!!errors.category}
                    >
                      <option value="">Select a category</option>
                      <option value="Technology">Technology</option>
                      <option value="Health">Health</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Business">Business</option>
                      <option value="Travel">Travel</option>
                    </Input>
                  )}
                />
                {errors.category && (
                  <FormText color="danger">{errors.category.message}</FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="postTags">Tags</Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="postTags"
                      placeholder="Enter tags separated by commas"
                      type="text"
                      invalid={!!errors.tags}
                    />
                  )}
                />
                {errors.tags && (
                  <FormText color="danger">{errors.tags.message}</FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="postImage">Upload Image</Label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="postImage"
                      type="file"
                      invalid={!!errors.image}
                    />
                  )}
                />
                {errors.image && (
                  <FormText color="danger">{errors.image.message}</FormText>
                )}
              </FormGroup>
              <Button className="mt-2" type="submit">
                Submit
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Forms;
