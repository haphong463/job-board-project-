import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCVsAsync,
  deleteCVAsync,
  disableCVAsync,
  selectAllCVs,
} from '../../../features/cvSlice';
import CreateForm from './CreateForm';
import UpdateForm from './UpdateForm';
import DetailsForm from './DetailsForm'; // Import the DetailsForm component
import DataTable from 'react-data-table-component';
import {
  Row,
  Col,
  Card,
  CardTitle,
  InputGroup,
  InputGroupText,
  Input,
  Button,
  Alert,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import './css/cvManagement.css'
const CVManagement = () => {
  const dispatch = useDispatch();
  const cvs = useSelector(selectAllCVs);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCVModal, setNewCVModal] = useState(false);
  const [updateCVModal, setUpdateCVModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false); // State for DetailsForm modal
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    dispatch(fetchCVsAsync())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch]);

  const toggleNewCVModal = () => {
    setNewCVModal(!newCVModal);
  };
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (templateId) => {
    if (openDropdownId === templateId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(templateId);
    }
  };
  const toggleUpdateCVModal = () => {
    setUpdateCVModal(!updateCVModal);
  };

  const toggleDetailsModal = () => {
    setDetailsModal(!detailsModal);
  };
  const isCVDisabled = (cv) => {
    return cv.disabled;
  };
  const handleDisable = async (id) => {
    try {
      await dispatch(disableCVAsync(id)).unwrap();
      setSuccessMessage('CV successfully disabled');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error disabling CV:', error);
      setErrorMessage('Error disabling CV');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  const isCVInUse = (cv) => {
    // Replace this with actual logic to determine if CV is in use
    return cv.references && cv.references.length > 0;
  };
  const handleEdit = (template) => {
    setSelectedTemplate(template);
    toggleUpdateCVModal();
  };

  const handleDetails = (template) => {
    setSelectedTemplate(template);
    toggleDetailsModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        await dispatch(deleteCVAsync(id)).unwrap();
        setSuccessMessage('Delete successful');
        setTimeout(() => setSuccessMessage(''), 3000);
        dispatch(fetchCVsAsync());
      } catch (error) {
    
          console.error('Error deleting CV:', error);
          setErrorMessage('Cannot delete this CV because it is currently in use.');
          setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const columns = [
    {
      name: 'Template Name',
      selector: (row) => row.templateName,
      sortable: true,
    },
    {
      name: 'Template Image',
      selector: (row) => row.templateImageBase64,
      cell: (row) => (
        <img
          src={`data:image/png;base64,${row.templateImageBase64}`}
          alt={row.templateName}
          style={{ width: '200px', height: 'auto' }}
        />
      ),
      sortable: false,
    },
    {
      name: 'Description',
      selector: (row) => row.templateDescription,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <Dropdown isOpen={openDropdownId === row.templateId} toggle={() => toggleDropdown(row.templateId)}>
          <DropdownToggle caret className="dropdown-toggle">
            Actions
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu">
            <DropdownItem className="dropdown-details" onClick={() => handleDetails(row)}>
              Details
            </DropdownItem>
            <DropdownItem className="dropdown-edit" onClick={() => handleEdit(row)}>
              Edit
            </DropdownItem>
            <DropdownItem
              className="dropdown-delete"
              onClick={() => handleDelete(row.templateId)}
              disabled={isCVInUse(row)}
            >
              Delete
            </DropdownItem>
            <DropdownItem
              className="dropdown-disable"
              onClick={() => handleDisable(row.templateId)}
              disabled={isCVDisabled(row)}
            >
              Disable
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ),
    },
  ];

  return (
    <Row>
      <Col lg="12">
        {successMessage && (
          <Alert color="success">{successMessage}</Alert>
        )}
        {errorMessage && (
          <Alert color="danger">{errorMessage}</Alert>
        )}
        <div className="d-flex justify-content-end mb-2">
          <Button color="danger" onClick={toggleNewCVModal}>
            New CV
          </Button>
          <CreateForm isOpen={newCVModal} toggle={toggleNewCVModal} />
        </div>
      </Col>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            CV List
          </CardTitle>
          <InputGroup className="mb-3">
            <InputGroupText>Search</InputGroupText>
            <Input
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          {!loading ? (
            <DataTable
              columns={columns}
              data={cvs ? cvs.filter((cv) =>
                cv.templateName.toLowerCase().includes(searchTerm.toLowerCase())
              ) : []}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
            />
          ) : (
            <p>Loading CVs...</p>
          )}
        </Card>
      </Col>
      {selectedTemplate && (
        <UpdateForm
          isOpen={updateCVModal}
          toggle={toggleUpdateCVModal}
          templateData={selectedTemplate}
        />
      )}
      {selectedTemplate && (
        <DetailsForm
          isOpen={detailsModal}
          toggle={toggleDetailsModal}
          templateData={selectedTemplate}
        />
      )}
    </Row>
  );
};

export default CVManagement;
