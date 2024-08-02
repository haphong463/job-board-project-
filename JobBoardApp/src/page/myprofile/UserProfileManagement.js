import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaLink, FaPlus, FaExternalLinkAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchUserThunk } from "../../features/userSlice";
import { fetchCertificatesByUserIdThunk, createCertificateThunk, updateCertificateThunk, deleteCertificateThunk } from "../../features/certificateSlice";
import MyProfile from './myprofile';

const UserProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    organization: '',
    issueDate: '',
    link: '',
    description: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const certificates = useSelector((state) => state.certificates.certificates) || [];
  const loading = useSelector((state) => state.certificates.loading);
  const error = useSelector((state) => state.certificates.error);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");
    if (token && username) {
      dispatch(fetchUserThunk({ username, token }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCertificatesByUserIdThunk(user.id));
    }
  }, [dispatch, user?.id]);

  const handleManageCVClick = () => {
    navigate('/myprofile');
  };

  const handleAddCertificate = () => {
    dispatch(createCertificateThunk({ ...newCertificate, userId: user.id }));
    setNewCertificate({ name: '', organization: '', issueDate: '', link: '', description: '' }); // Clear form
    setShowAddModal(false);
  };

  const handleUpdateCertificate = () => {
    if (selectedCertificate) {
      dispatch(updateCertificateThunk({ id: selectedCertificate.id, certificateDTO: newCertificate }));
      setSelectedCertificate(null);
      setNewCertificate({ name: '', organization: '', issueDate: '', link: '', description: '' }); // Clear form
      setShowEditModal(false);
    }
  };

  const handleDeleteCertificate = (id) => {
    dispatch(deleteCertificateThunk(id));
  };

  const handleModalChange = (e) => {
    setNewCertificate({
      ...newCertificate,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container fluid>
      {/* Breadcrumb Navigation */}
      <Row className="mt-3">
        <Col>
          <nav aria-label="breadcrumb" className="main-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">User</li>
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

          {/* Certificate Management */}
          <Card className="mt-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Certificates</h4>
                <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>
                  <FaPlus /> Add Certificate
                </Button>
              </div>
              {loading && <p>Loading certificates...</p>}
              {error && <p>Error fetching certificates: {error}</p>}
              {certificates.length === 0 ? (
                <p>No certificates available.</p>
              ) : (
                <ul>
                  {certificates.map((cert) => (
                    <li key={cert.id}>
                      {cert.name} - {cert.organization} ({cert.issueDate}) 
                      {cert.link && (
                        <Button 
                          variant="link" 
                          className="ml-2" 
                          href={cert.link} 
                          target="_blank"
                        >
                          <FaExternalLinkAlt />
                        </Button>
                      )}
                      <Button 
                        variant="outline-warning" 
                        className="ms-2"
                        onClick={() => {
                          setNewCertificate(cert);
                          setSelectedCertificate(cert);
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        className="ms-2"
                        onClick={() => handleDeleteCertificate(cert.id)}
                      >
                        <FaTrash />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Adding Certificate */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Certificate Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCertificate.name}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Issued By</Form.Label>
              <Form.Control
                type="text"
                name="organization"
                value={newCertificate.organization}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Issue Date</Form.Label>
              <Form.Control
                type="month"
                name="issueDate"
                value={newCertificate.issueDate}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Certificate Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={newCertificate.link || ''}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newCertificate.description || ''}
                onChange={handleModalChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddCertificate}>Add Certificate</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Editing Certificate */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Certificate Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCertificate.name}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Issued By</Form.Label>
              <Form.Control
                type="text"
                name="organization"
                value={newCertificate.organization}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Issue Date</Form.Label>
              <Form.Control
                type="month"
                name="issueDate"
                value={newCertificate.issueDate}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Certificate Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={newCertificate.link || ''}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newCertificate.description || ''}
                onChange={handleModalChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateCertificate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfileManagement;
