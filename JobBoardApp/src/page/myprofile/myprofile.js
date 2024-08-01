import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserThunk, updateUserThunk } from "../../features/userSlice";
import Swal from "sweetalert2";
import { Form, FormGroup, Label, Input, Button, Col, Row, Card, CardBody, CardTitle, CardText } from "reactstrap";
import { FaCamera } from 'react-icons/fa'; // Font Awesome camera icon

export const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    bio: "",
    website: "",
    github: "",
    twitter: "",
    instagram: "",
    facebook: "",
    numberphone: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [overallEditMode, setOverallEditMode] = useState(false);
  const [editMode, setEditMode] = useState({
    facebook: false,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");
    if (!token || !username) {
      navigate("/login");
    } else {
      setLoggedIn(true);
      dispatch(fetchUserThunk({ username, token }));
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        bio: user.bio,
        facebook: user.facebook || "",
        numberphone: user.numberphone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [tempImageUrl, setTempImageUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("gender", userData.gender);
    formData.append("bio", userData.bio);
    formData.append("website", userData.website);
    formData.append("github", userData.github);
    formData.append("twitter", userData.twitter);
    formData.append("instagram", userData.instagram);
    formData.append("facebook", userData.facebook);
    formData.append("numberphone", userData.numberphone);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
  
    dispatch(updateUserThunk({ formData, userId: user.id }))
      .unwrap()
      .then(() => {
        Swal.fire("Success", "Profile updated successfully", "success");
        dispatch(fetchUserThunk({ username: localStorage.getItem("username"), token: localStorage.getItem("accessToken") }));
        setOverallEditMode(false);
        setImageFile(null); // Reset imageFile after successful update
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  };
  const handleFacebookSave = () => {
    handleEditToggle('facebook');
    handleFormSubmit({ preventDefault: () => {} });
  };
  const handleEditToggle = (field) => {
    setEditMode((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  return (
    loggedIn && (
      <div className="container mt-4">
         <nav aria-label="breadcrumb" class="main-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item"><a href="managementprofile">User</a></li>
              <li class="breadcrumb-item active" aria-current="page">User Profile</li>
            </ol>
          </nav>
        <div className="main-body">
          <div className="row">
            <Col lg={4} md={6} sm={12}>
              <Card className="profile-card">
                <CardBody className="text-center position-relative">
                <div className="profile-img-container">
                <img
  alt="Avatar"
  src={tempImageUrl || user?.imageUrl || "https://bootdey.com/img/Content/avatar/avatar6.png"}
  className="rounded-circle profile-img"
/>
  <Button
    className="camera-icon-button"
    color="link"
    onClick={() => fileInputRef.current.click()}
  >
    <FaCamera size={24} className="text-primary" />
  </Button>
</div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <CardTitle tag="h4" className="mt-3">
                    {`${user?.firstName} ${user?.lastName}`}
                  </CardTitle>
                  <CardText className="text-muted">{user?.bio || "No bio available"}</CardText>
                </CardBody>
                <hr className="my-4" />
                <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
  <h6 className="mb-0">
    <i className="bi bi-facebook me-2 text-primary"></i>Facebook
  </h6>
  {editMode.facebook ? (
    <div className="d-flex align-items-center">
      <Input
        type="text"
        name="facebook"
        value={userData.facebook}
        onChange={handleInputChange}
        className="me-2"
      />
<Button color="success" onClick={handleFacebookSave}>Save</Button>
</div>
  ) : (
    <div className="d-flex align-items-center">
      <span className="text-secondary">{userData.facebook || 'N/A'}</span>
      <Button color="info" className="ms-2" onClick={() => handleEditToggle('facebook')}>Edit</Button>
    </div>
  )}
</li>
                </ul>
              </Card>
            </Col>
              
            <Col lg={8} md={6} sm={12}>
              <Card className="mb-4">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="card-title">User Profile</h4>
                    <Button color="info" onClick={() => setOverallEditMode(!overallEditMode)}>
                      {overallEditMode ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                  <Form onSubmit={handleFormSubmit}>
                    <Row className="mb-3">
                      <Label sm={3}>First Name</Label>
                      <Col sm={9}>
                        <Input
                          type="text"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleInputChange}
                          readOnly={!overallEditMode}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Label sm={3}>Last Name</Label>
                      <Col sm={9}>
                        <Input
                          type="text"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleInputChange}
                          readOnly={!overallEditMode}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Label sm={3}>Gender</Label>
                      <Col sm={9}>
                        <Input
                          type="text"
                          name="gender"
                          value={userData.gender}
                          onChange={handleInputChange}
                          readOnly={!overallEditMode}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Label sm={3}>Bio</Label>
                      <Col sm={9}>
                        <Input
                          type="textarea"
                          name="bio"
                          value={userData.bio}
                          onChange={handleInputChange}
                          readOnly={!overallEditMode}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Label sm={3}>Numberphone</Label>
                      <Col sm={9}>
                        <Input
                          type="text"
                          name="numberphone"
                          value={userData.numberphone}
                          onChange={handleInputChange}
                          readOnly={!overallEditMode}
                        />
                      </Col>
                    </Row>
                    {overallEditMode && (
                      <Button type="submit" color="primary">
                        Update Profile
                      </Button>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </div>
        </div>
      </div>
    )
  );
};

export default UserProfile;
