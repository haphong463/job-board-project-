import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormFeedback,
  CardHeader,
} from "reactstrap";
import { getUserByIDThunk, updateUserThunk } from "../../../features/authSlice";
import { createFormData } from "../../../utils/form-data/formDataUtil";
import classnames from "classnames";
import { updatePasswordAsync } from "../../../services/user_service";
import showToast from "../../../utils/functions/showToast";
import moment from "moment/moment";
import "./style.css";

const profileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  bio: yup.string(),
  gender: yup
    .string()
    .oneOf(["MALE", "FEMALE", "OTHER"])
    .required("Gender is required"),
  imageFile: yup.mixed().test("fileSize", "File is too large", (value) => {
    return !value || (value && value.size <= 2000000); // 2MB
  }),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required")
    .notOneOf(
      [yup.ref("currentPassword"), null],
      "New password cannot be the same as the current password"
    ),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm new password is required"),
});

const User = () => {
  const user = useSelector((state) => state.auth.user);
  const userEdit = useSelector((state) => state.auth.userEdit);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: userEdit?.firstName,
      lastName: userEdit?.lastName,
      bio: userEdit?.bio,
      gender: userEdit?.gender,
      imageFile: "",
    },
  });

  const {
    control: controlPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data) => {
    data = {
      ...data,
      id: user.id,
      username: user.sub,
    };

    const formData = createFormData(data);
    dispatch(updateUserThunk({ formData, userId: data.id }));
    setEditMode(false);
  };

  const handleChangePassword = async (data) => {
    try {
      const id = user.id;
      const { currentPassword, newPassword } = data;
      await updatePasswordAsync(id, currentPassword, newPassword);
      showToast("Password updated successfully", "success");
      resetPasswordForm();
    } catch (error) {
      showToast(error.response.data, "error");
    }
  };

  useEffect(() => {
    if (!userEdit) {
      dispatch(getUserByIDThunk(user.sub)).then((res) => {
        const reqStatus = res.meta.requestStatus;
        const payload = res.payload;
        if (reqStatus === "fulfilled") {
          setValue("bio", payload.bio);
          setValue("firstName", payload.firstName);
          setValue("lastName", payload.lastName);
          setValue("gender", payload.gender);
        }
      });
    }
  }, [userEdit]);

  console.log(">>>userEdit:", userEdit);

  const isAdmin = userEdit?.roles.some((role) => role.name === "ROLE_ADMIN");
  const isModerator = userEdit?.roles.some(
    (role) => role.name === "ROLE_MODERATOR"
  );

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    userEdit && (
      <Row>
        <Col lg={4} md={6} sm={12}>
          <Card>
            <CardHeader>
              Updated {moment(userEdit?.updatedAt).from()}
            </CardHeader>
            <CardBody className="text-center">
              <img
                alt="Avatar"
                src={userEdit?.imageUrl}
                className="rounded-circle img-fluid"
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "contain",
                }}
              />
              <CardTitle tag="h5" className="mt-3">
                {`${userEdit?.firstName} ${userEdit?.lastName}`}
              </CardTitle>
              <CardText>
                {isAdmin
                  ? "Administrator"
                  : isModerator
                  ? "Moderator"
                  : userEdit?.roles.map((item) => item.name).join(", ")}
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col lg={8} md={6} sm={12}>
          <Card className="p-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "profile" })}
                  onClick={() => toggleTab("profile")}
                >
                  Edit Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "password" })}
                  onClick={() => toggleTab("password")}
                >
                  Change Password
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="profile">
                {!editMode ? (
                  <Table>
                    <tbody>
                      <tr>
                        <th style={{ width: "150px" }}>Username</th>
                        <td>{user.sub}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{userEdit?.email}</td>
                      </tr>
                      <tr>
                        <th>Full Name</th>
                        <td>
                          {userEdit?.firstName} {userEdit?.lastName}
                        </td>
                      </tr>
                      <tr>
                        <th>Bio</th>
                        <td>
                          <p className="text-truncate-multiline">
                            {userEdit?.bio}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <th>Gender</th>
                        <td>{userEdit?.gender}</td>
                      </tr>
                    </tbody>
                  </Table>
                ) : (
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                      <Label for="firstName">First Name</Label>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="firstName"
                            placeholder="Enter your first name"
                          />
                        )}
                      />
                      {errors.firstName && <p>{errors.firstName.message}</p>}
                    </FormGroup>
                    <FormGroup>
                      <Label for="lastName">Last Name</Label>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="lastName"
                            placeholder="Enter your last name"
                          />
                        )}
                      />
                      {errors.lastName && <p>{errors.lastName.message}</p>}
                    </FormGroup>
                    <FormGroup>
                      <Label for="bio">Bio</Label>
                      <Controller
                        name="bio"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="bio"
                            type="textarea"
                            rows={10}
                            placeholder="Enter your bio"
                          />
                        )}
                      />
                      {errors.bio && <p>{errors.bio.message}</p>}
                    </FormGroup>
                    <FormGroup>
                      <Label for="gender">Gender</Label>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} id="gender" type="select">
                            <option value="" disabled>
                              Select your gender
                            </option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </Input>
                        )}
                      />
                      {errors.gender && <p>{errors.gender.message}</p>}
                    </FormGroup>
                    <FormGroup>
                      <Label for="file">Avatar</Label>
                      <Controller
                        name="imageFile"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="file"
                            type="file"
                            onChange={(e) =>
                              setValue("imageFile", e.target.files[0], {
                                shouldDirty: true,
                              })
                            }
                          />
                        )}
                      />
                      {errors.imageFile && <p>{errors.imageFile.message}</p>}
                    </FormGroup>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={!isDirty}
                      className="mr-2"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                  </Form>
                )}
                {!editMode && (
                  <Button
                    color="primary"
                    onClick={() => setEditMode(true)}
                    className="mt-3"
                  >
                    Edit Profile
                  </Button>
                )}
              </TabPane>
              <TabPane tabId="password">
                <Form onSubmit={handlePasswordSubmit(handleChangePassword)}>
                  <FormGroup>
                    <Label for="currentPassword">Current Password</Label>
                    <Controller
                      name="currentPassword"
                      control={controlPassword}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="currentPassword"
                          type="password"
                          placeholder="Enter your current password"
                          invalid={!!passwordErrors.currentPassword}
                        />
                      )}
                    />
                    {passwordErrors.currentPassword && (
                      <FormFeedback>
                        {passwordErrors.currentPassword.message}
                      </FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="newPassword">New Password</Label>
                    <Controller
                      name="newPassword"
                      control={controlPassword}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="newPassword"
                          type="password"
                          placeholder="Enter your new password"
                          invalid={!!passwordErrors.newPassword}
                        />
                      )}
                    />
                    {passwordErrors.newPassword && (
                      <FormFeedback>
                        {passwordErrors.newPassword.message}
                      </FormFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="confirmNewPassword">Confirm New Password</Label>
                    <Controller
                      name="confirmNewPassword"
                      control={controlPassword}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="confirmNewPassword"
                          type="password"
                          placeholder="Confirm your new password"
                          invalid={!!passwordErrors.confirmNewPassword}
                        />
                      )}
                    />
                    {passwordErrors.confirmNewPassword && (
                      <FormFeedback>
                        {passwordErrors.confirmNewPassword.message}
                      </FormFeedback>
                    )}
                  </FormGroup>
                  <Button type="submit" color="primary">
                    Change Password
                  </Button>
                </Form>
              </TabPane>
            </TabContent>
          </Card>
        </Col>
      </Row>
    )
  );
};

export default User;
