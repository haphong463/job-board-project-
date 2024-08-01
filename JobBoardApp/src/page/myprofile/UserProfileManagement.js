import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaLink, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchUserThunk } from "../../features/userSlice";
// import './UserProfileManagement.css'; // Ensure custom styling
import MyProfile from './myprofile';

const UserProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");
    if (token && username) {
      dispatch(fetchUserThunk({ username, token }));
    }
  }, [dispatch]);

  const handleManageCVClick = () => {
    navigate('/myprofile');
  };

  return (
    <Container fluid>
      {/* Breadcrumb Navigation */}
      <Row className="mt-3">
        <Col>
          <nav aria-label="breadcrumb" className="main-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active " aria-current="page">User</li>
            </ol>
          </nav>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={3}>
          <Card className="profile-summary-card">
            <Card.Body>
              <div className="text-center">
                <div className="profile-image-container">
                  <img
                    src={user?.imageUrl || "https://bootdey.com/img/Content/avatar/avatar6.png"}
                    alt="Profile"
                    className="profile-image"
                  />
         
                </div>
                <h5 className="mt-3">{`${user?.firstName || ''} ${user?.lastName || ''}`}</h5>
                <p className="text-muted">{user?.bio || "No bio available"}</p>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h5>Select a CV template and download</h5>
              <Button variant="danger" className="w-100" onClick={handleManageCVClick}>View and Download CV</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>{activeTab === 'profile' ? 'Personal Information' : 'Manage CV'}</h4>
                <div>
                  <Button
                    variant="outline-success"
                    className="me-2"
                    active={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="outline-success"
                    active={activeTab === 'manage'}
                    onClick={() => {
                      setActiveTab('manage');
                      handleManageCVClick(); // Trigger navigation
                    }}
                  >
                    Manage Profile
                  </Button>
                </div>
              </div>

              {activeTab === 'profile' ? (
                <Form>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaUser /> Full Name</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="text" value={`${user?.firstName || ''} ${user?.lastName || ''}`} readOnly />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaEnvelope /> Email</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="email" value={user?.email || ''} readOnly />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaCalendar /> Date of Birth</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="date" value={user?.birthDate || ''} readOnly />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaMapMarkerAlt /> Current Address</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="text" value={user?.address || ''} readOnly />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaLink /> Personal Link</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="text" value={user?.facebook || ''} readOnly />
                    </Col>
                  </Form.Group>
                </Form>
              ) : (
                <MyProfile />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfileManagement;
