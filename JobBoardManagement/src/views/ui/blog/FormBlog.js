import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Editor } from "@tinymce/tinymce-react";
import { slugify } from "../../../utils/functions/convertToSlug";
import { createFormData } from "../../../utils/form-data/formDataUtil";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addBlog } from "../../../features/blogSlice";
import {
  fetchBlogCategory,
  addBlogCategory,
} from "../../../features/blogCategorySlice";
import { BlogForm } from "./BlogForm";
import { BlogCategoryForm } from "../blog-category/BlogCategoryForm";
import {
  blogCategorySchema,
  blogSchema,
} from "../../../utils/variables/schema";
import Select from "react-select";
const FormBlog = (args) => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.blogCategory.blogCategory);
  const categoryStatus = useSelector((state) => state.blogCategory.status);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);


  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(blogSchema),
    defaultValues: {
      title: "",
      tags: "",
      content: "",
      blogCategoryId: "",
      image: "",
    },
  });

  const onSubmit = (data) => {
    const newData = {
      ...data,
      slug: slugify(data.title),
      author: "Testttt",
      status: 1,
    };

    const formData = createFormData(newData);
    dispatch(addBlog(formData)).then(() => {
      toggle();
    });
  };

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchBlogCategory());
    }
  }, [categoryStatus, dispatch]);

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <Button color="danger" onClick={toggle}>
          <IoMdAdd className="me-2" />
          New blog
        </Button>
      </div>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            toggle={toggle}
            tag="h6"
            className="border-bottom p-3 mb-0"
          >
            <i className="bi bi-pencil me-2"> </i>
            Create Blog Post
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md={6}>
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
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Editor
                    apiKey={process.env.REACT_APP_TINYMCE_KEY}
                    init={{
                      plugins:
                        "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                      toolbar:
                        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                    }}
                    initialValue="Welcome to TinyMCE!"
                    onEditorChange={(newValue, editor) =>
                      setValue("content", newValue, {
                        shouldValidate: true,
                      })
                    }
                  />
                  {errors.content && (
                    <FormText color="danger">{errors.content.message}</FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="postCategory">Category</Label>
                  <Controller
                    name="blogCategoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="postCategory"
                        options={categoryList.map((category) => ({
                          value: category.id,
                          label: category.name,
                        }))}
                        isSearchable={false}
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption.value)
                        }
                        value={categoryList.find(
                          (category) => category.id === field
                        )}
                      />
                    )}
                  />
                  {/* <Controller
                  name="blogCategoryId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="postCategory"
                      type="select"
                      invalid={!!errors.blogCategoryId}
                      onChange={(e) => {
                        field.onChange(e);
                        handleCategoryChange(e);
                      }}
                    >
                      <option disabled value="">
                        --- Select category ---
                      </option>
                      {categoryList.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Input>
                  )}
                /> */}
                  {errors.blogCategoryId && (
                    <FormText color="danger">
                      {errors.blogCategoryId.message}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="postImage">Upload Image</Label>
                  <Input
                    id="postImage"
                    type="file"
                    onChange={(e) => {
                      setValue("image", e.target.files[0], {
                        shouldValidate: true,
                      });
                    }}
                    invalid={!!errors.image}
                  />
                  {errors.image && (
                    <FormText color="danger">{errors.image.message}</FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Submit
            </Button>
            <Button color="secondary" type="button" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default FormBlog;
