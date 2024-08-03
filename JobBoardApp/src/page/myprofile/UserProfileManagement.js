import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaLink, FaPlus, FaExternalLinkAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchUserThunk } from "../../features/userSlice";
import { fetchCertificatesByUserIdThunk, createCertificateThunk, updateCertificateThunk, deleteCertificateThunk } from "../../features/certificateSlice";
import { fetchEducationThunk } from "../../features/userSlice";
import MyProfile from './myprofile';

const UserProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [showEditCertificateModal, setShowEditCertificateModal] = useState(false);
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
  const education = useSelector((state) => state.user.education) || [];
  const loading = useSelector((state) => state.certificates.loading);
  const error = useSelector((state) => state.certificates.error);
  const educationLoading = useSelector((state) => state.user.educationStatus) === 'loading';
  const educationError = useSelector((state) => state.user.educationError);

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
      dispatch(fetchEducationThunk(user.id));
    }
  }, [dispatch, user?.id]);

  const handleManageCVClick = () => {
    navigate('/myprofile');
  };

  const handleAddCertificate = () => {
    dispatch(createCertificateThunk({ ...newCertificate, userId: user.id }));
    setNewCertificate({ name: '', organization: '', issueDate: '', link: '', description: '' });
    setShowAddCertificateModal(false);
  };

  const handleUpdateCertificate = () => {
    if (selectedCertificate) {
      dispatch(updateCertificateThunk({ id: selectedCertificate.id, certificateDTO: newCertificate }));
      setSelectedCertificate(null);
      setNewCertificate({ name: '', organization: '', issueDate: '', link: '', description: '' });
      setShowEditCertificateModal(false);
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
                      <Form.Control type="date" value={user?.dateOfBirth || ''} readOnly />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaMapMarkerAlt /> Current Address</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="text" value={user?.currentAddress || ''} readOnly />
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
                <Button variant="outline-primary" onClick={() => setShowAddCertificateModal(true)}>
                  <FaPlus /> Add Certificate
                </Button>
              </div>
              {loading && <p>Loading certificates...</p>}
              {error && <p>Error fetching certificates: {error}</p>}
              {certificates.length === 0 ? (
                <p>No certificates found</p>
              ) : (
                <ul className="list-unstyled">
                  {certificates.map((certificate) => (
                    <li key={certificate.id} className="mb-3">
                      <Card>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5>{certificate.name}</h5>
                              <p>{certificate.organization}</p>
                              <p>{certificate.issueDate}</p>
                              <p>{certificate.description}</p>
                              <a href={certificate.link} target="_blank" rel="noopener noreferrer">
                                <FaExternalLinkAlt /> View Certificate
                              </a>
                            </div>
                            <div>
                              <Button
                                variant="outline-secondary"
                                className="me-2"
                                onClick={() => {
                                  setSelectedCertificate(certificate);
                                  setNewCertificate(certificate);
                                  setShowEditCertificateModal(true);
                                }}
                              >
                                <FaEdit /> Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={() => handleDeleteCertificate(certificate.id)}
                              >
                                <FaTrash /> Delete
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Education Management */}
          <Card className="mt-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Education</h4>
         
              </div>
              {educationLoading && <p>Loading education...</p>}
              {educationError && <p>Error fetching education: {educationError}</p>}
              {education.length === 0 ? (
                <p>No education records found</p>
              ) : (
                <ul className="list-unstyled">
                  {education.map((edu) => (
                    <li key={edu.id} className="mb-3">
                      <Card>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5>{edu.degree}</h5>
                              <p>{edu.institution}</p>
                              <p>{edu.startDate} - {edu.endDate}</p>
                            </div>
                            <div>
                             
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Add Certificate Modal */}
          <Modal show={showAddCertificateModal} onHide={() => setShowAddCertificateModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add Certificate</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newCertificate.name}
                    onChange={handleModalChange}
                    placeholder="Certificate Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Organization</Form.Label>
                  <Form.Control
                    type="text"
                    name="organization"
                    value={newCertificate.organization}
                    onChange={handleModalChange}
                    placeholder="Issuing Organization"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Issue Date</Form.Label>
                  <Form.Control
                    type="month"
                    name="issueDate"
                    value={newCertificate.issueDate}
                    onChange={handleModalChange}
                    placeholder="Issue Date"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    type="text"
                    name="link"
                    value={newCertificate.link}
                    onChange={handleModalChange}
                    placeholder="Certificate Link"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={newCertificate.description}
                    onChange={handleModalChange}
                    placeholder="Certificate Description"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddCertificateModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleAddCertificate}>
                Add Certificate
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Certificate Modal */}
          <Modal show={showEditCertificateModal} onHide={() => setShowEditCertificateModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Certificate</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newCertificate.name}
                    onChange={handleModalChange}
                    placeholder="Certificate Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Organization</Form.Label>
                  <Form.Control
                    type="text"
                    name="organization"
                    value={newCertificate.organization}
                    onChange={handleModalChange}
                    placeholder="Issuing Organization"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Issue Date</Form.Label>
                  <Form.Control
                    type="month"
                    name="issueDate"
                    value={newCertificate.issueDate}
                    onChange={handleModalChange}
                    placeholder="Issue Date"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    type="text"
                    name="link"
                    value={newCertificate.link}
                    onChange={handleModalChange}
                    placeholder="Certificate Link"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={newCertificate.description}
                    onChange={handleModalChange}
                    placeholder="Certificate Description"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditCertificateModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdateCertificate}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Education Modal */}
         
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfileManagement;
