import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { createCVAsync, uploadCVAsync } from '../../../features/cvSlice';

const CreateForm = ({ toggle, isOpen }) => {
  const dispatch = useDispatch();

  const [uploadTemplateName, setUploadTemplateName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [createTemplateName, setCreateTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateFilePath, setTemplateFilePath] = useState('');
  const [templateImage, setTemplateImage] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [uploadFormDisabled, setUploadFormDisabled] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);

  useEffect(() => {
    setCreateTemplateName(uploadTemplateName);
  }, [uploadTemplateName]);

  const handleFileChangeUpload = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setTemplateImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    setLoadingUpload(true);

    try {
      const result = await dispatch(uploadCVAsync({ file: uploadFile, templateName: uploadTemplateName })).unwrap();

      // Set success message
      setUploadMessage('Template uploaded successfully');
      setLoadingUpload(false);

      // Enable Create button and set Template File Path
      setCreateButtonDisabled(false);
      setTemplateFilePath(`http://localhost:8080/api/templates/${uploadTemplateName}`);

      // Disable Upload form after successful upload
      setUploadFormDisabled(true);
    } catch (error) {
      console.error('Error uploading template:', error);
      setUploadMessage('Error uploading template: ' + error.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleCreate = async () => {
    setLoadingCreate(true);

    try {
      const formData = new FormData();
      formData.append('templateName', createTemplateName);
      formData.append('templateDescription', templateDescription);
      formData.append('templateFilePath', templateFilePath);
      formData.append('templateImage', templateImage);

      await dispatch(createCVAsync(formData)).unwrap();

      // Reset form fields
      setUploadTemplateName('');
      setTemplateDescription('');
      setTemplateFilePath('');
      setTemplateImage(null);

      // Disable Create button after successful creation
      setCreateButtonDisabled(true);

      // Close the modal after successful creation
      toggle();
    } catch (error) {
      console.error('Error creating template:', error);
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Combined CV Actions</ModalHeader>
      <ModalBody>
        {/* Upload CV Form */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Upload CV File</h5>
          </div>
          <div className="card-body">
            {/* Upload message */}
            {uploadMessage && <div className="alert alert-info">{uploadMessage}</div>}
            {/* Upload form */}
            <Form>
              <FormGroup>
                <Label for="templateNameUpload">Template Name:</Label>
                <Input
                  type="text"
                  id="templateNameUpload"
                  value={uploadTemplateName}
                  onChange={(e) => setUploadTemplateName(e.target.value)}
                  required
                  disabled={uploadFormDisabled}
                />
              </FormGroup>
              <FormGroup>
                <Label for="fileUpload">Upload HTML File:</Label>
                <Input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileChangeUpload}
                  accept=".html"
                  required
                  disabled={uploadFormDisabled}
                />
              </FormGroup>
              <Button color="primary" onClick={handleUpload} disabled={loadingUpload || uploadFormDisabled}>
                {loadingUpload ? 'Uploading...' : 'Upload Template'}
              </Button>
            </Form>
          </div>
        </div>

        {/* Create CV Form */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Create New CV</h5>
          </div>
          <div className="card-body">
            {/* Create form */}
            <Form>
              <FormGroup>
                <Label for="templateDescription">Template Description:</Label>
                <Input
                  type="text"
                  id="templateDescription"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="templateFilePath">Template File Path (URL):</Label>
                <Input
                  type="text"
                  id="templateFilePath"
                  value={templateFilePath || `http://localhost:8080/api/templates/${createTemplateName}`}
                  onChange={(e) => setTemplateFilePath(e.target.value)}
                  required
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label for="templateImage">Upload Template Image:</Label>
                <Input
                  type="file"
                  id="templateImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </FormGroup>
              <Button color="primary" onClick={handleCreate} disabled={loadingCreate || createButtonDisabled}>
                {loadingCreate ? 'Creating...' : 'Create Template'}
              </Button>
            </Form>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateForm;
