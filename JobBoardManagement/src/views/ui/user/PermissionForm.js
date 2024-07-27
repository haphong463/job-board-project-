import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { updatePermissionsThunk } from "../../../features/userSlice";

const PermissionForm = ({ userId, currentPermissions, isOpen, toggle }) => {
  const dispatch = useDispatch();
  const [permissions, setPermissions] = useState(currentPermissions);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    setPermissions((prev) =>
      checked ? [...prev, value] : prev.filter((perm) => perm !== value)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePermissionsThunk({ userId, permissions }));
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Assign Permissions</ModalHeader>
        <ModalBody>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                value="MANAGE_BLOG"
                checked={permissions.includes("MANAGE_BLOG")}
                onChange={handleChange}
              />
              Manage Blog
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                value="MANAGE_JOB"
                checked={permissions.includes("MANAGE_JOB")}
                onChange={handleChange}
              />
              Manage Job
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                value="MANAGE_COMPANY"
                checked={permissions.includes("MANAGE_COMPANY")}
                onChange={handleChange}
              />
              Manage Company
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">Save</Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default PermissionForm;
