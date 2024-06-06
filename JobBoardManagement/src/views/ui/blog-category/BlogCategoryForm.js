import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { blogCategorySchema } from "../../../utils/variables/schema";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoMdAdd } from "react-icons/io";
import { useDispatch } from "react-redux";
import {
  addBlogCategory,
  updateBlogCategory,
} from "../../../features/blogCategorySlice";

export function BlogCategoryForm({ isEdit, setIsEdit }) {
  const dispatch = useDispatch();
  const [newCategoryModal, setNewCategoryModal] = useState(false);

  const toggleNewCategoryModal = () => {
    setNewCategoryModal(!newCategoryModal);
    if (isEdit) {
      setIsEdit(null); // Reset isEdit state when modal is toggled
    }
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(blogCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isEdit) {
      setNewCategoryModal(true);
      setValue("name", isEdit.name); // Set the default value when isEdit changes
    }
  }, [isEdit, setValue]);

  const onSubmit = (data) => {
    if (isEdit) {
      dispatch(updateBlogCategory({ ...data, id: isEdit.id })).then(() => {
        toggleNewCategoryModal();
      });
    } else {
      dispatch(addBlogCategory(data)).then(() => {
        toggleNewCategoryModal();
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <Button color="danger" onClick={toggleNewCategoryModal}>
          <IoMdAdd className="me-2" />
          New blog category
        </Button>
      </div>
      <Modal isOpen={newCategoryModal} toggle={toggleNewCategoryModal}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleNewCategoryModal}>
            {isEdit ? "Edit Category" : "Create New Category"}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="categoryName">Category Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="categoryName"
                    placeholder="Enter category name"
                    type="text"
                    invalid={!!errors.name}
                  />
                )}
              />
              {errors.name && (
                <FormText color="danger">{errors.name.message}</FormText>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              {isEdit ? "Update" : "Submit"}
            </Button>
            <Button
              color="secondary"
              type="button"
              onClick={toggleNewCategoryModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
}
