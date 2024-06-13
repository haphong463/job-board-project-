import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  FormText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Editor } from "@tinymce/tinymce-react";
import { slugify } from "../../../utils/functions/convertToSlug";
import { createFormData } from "../../../utils/form-data/formDataUtil";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addBlog, editBlog } from "../../../features/blogSlice";
import { fetchBlogCategory } from "../../../features/blogCategorySlice";
import { blogSchema } from "../../../utils/variables/schema";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import "./FormBlog.css";
import showToast from "../../../utils/functions/showToast";
import { LeftSideBlogForm } from "./LeftSideBlogForm";
import { RightSideBlogForm } from "./RightSideBlogForm";

const FormBlog = ({ isEdit, setIsEdit }) => {
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.blogCategory.blogCategory);
  const categoryStatus = useSelector((state) => state.blogCategory.status);
  const user = useSelector((state) => state.auth.user);
  const [modal, setModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
    getValues,
  } = useForm({
    resolver: yupResolver(blogSchema(isEdit)),
    defaultValues: {
      title: "",
      content: "",
      blogCategoryId: "",
      image: "",
      status: "",
    },
  });

  const toggle = () => {
    setModal(!modal);
    setIsEdit(null);
    reset();
  };

  const onSubmit = (data) => {
    const newData = {
      ...data,
      slug: slugify(data.title),
      username: user.sub,
    };

    if (!newData.image || newData.image.length === 0) {
      delete newData.image;
    }
    console.log(">>>newData: ", newData);

    const formData = createFormData(newData);
    if (!isEdit) {
      dispatch(addBlog(formData)).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          showToast("Blog added successfully!", "success");
          toggle();
        } else {
          showToast("Failed to add blog", "error");
        }
      });
    } else {
      dispatch(editBlog({ newBlog: formData, id: isEdit.id })).then(
        (response) => {
          if (response.meta.requestStatus === "fulfilled") {
            showToast("Blog updated successfully!", "success");
            toggle();
          } else {
            showToast("Failed to update blog", "error");
          }
        }
      );
    }
  };

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchBlogCategory());
    }
  }, [categoryStatus, dispatch]);

  useEffect(() => {
    if (isEdit) {
      setModal(true);
      setValue("title", isEdit.title); // Set the default value when isEdit changes
      setValue("content", isEdit.content); // Set the default value when isEdit changes
      setValue("blogCategoryId", isEdit.category.id); // Set the default value when isEdit changes
      setValue("status", isEdit.status); // Set the default value when isEdit changes
    }
  }, [isEdit, setValue]);

  useEffect(() => {
    const imageFile = watch("image");

    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);

      // Revoke the old object URL
      return () => URL.revokeObjectURL(objectUrl);
    }

    // Reset the preview URL if no image is selected
    setPreviewUrl(null);
  }, [watch("image")]);

  const defaultValue = isEdit && {
    label: isEdit.category.name,
    value: isEdit.category.id,
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      setValue("image", acceptedFiles[0], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
  });

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <Button color="danger" onClick={toggle}>
          <IoMdAdd className="me-2" />
          New blog
        </Button>
      </div>
      <Modal isOpen={modal} toggle={toggle} size="xl">
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
              <LeftSideBlogForm
                control={control}
                setValue={setValue}
                watch={watch}
                isEdit={isEdit}
                errors={errors}
              />
              <RightSideBlogForm
                categoryList={categoryList}
                previewUrl={previewUrl}
                control={control}
                defaultValue={defaultValue}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isEdit={isEdit}
                errors={errors}
                getValues={getValues}
              />
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={!isDirty}>
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
