import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { updateCVAsync } from '../../../features/cvSlice';

const UpdateForm = ({ toggle, isOpen, templateData }) => {
  const dispatch = useDispatch();

  const [templateName, setTemplateName] = useState(templateData.templateName || '');
  const [templateDescription, setTemplateDescription] = useState(templateData.templateDescription || '');
  const [templateHtmlFile, setTemplateHtmlFile] = useState(null);
  const [templateImage, setTemplateImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(templateData.templateImageBase64 || '');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    setTemplateName(templateData.templateName || '');
    setTemplateDescription(templateData.templateDescription || '');
    setImagePreviewUrl(templateData.templateImageBase64 || '');
  }, [templateData]);

  const handleFileChange = (e) => {
    setTemplateHtmlFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setTemplateImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    setLoadingUpdate(true);

    try {
      const formData = new FormData();
      formData.append('templateName', templateName); // Ensure templateName is sent but not editable
      formData.append('templateDescription', templateDescription);
      if (templateImage) formData.append('templateImage', templateImage);
      if (templateHtmlFile) formData.append('templateHtmlFile', templateHtmlFile);

      await dispatch(updateCVAsync({ id: templateData.templateId, formData })).unwrap();

      toggle(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating template:', error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Template</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="templateName">Template Name:</Label>
            <Input
              type="text"
              id="templateName"
              value={templateName}
              readOnly // Prevent user editing
              required
            />
          </FormGroup>
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
            <Label for="templateHtmlFile">Upload HTML File:</Label>
            <Input
              type="file"
              id="templateHtmlFile"
              onChange={handleFileChange}
              accept=".html"
            />
          </FormGroup>
          <FormGroup>
            <Label for="templateImage">Upload Template Image:</Label>
            <Input
              type="file"
              id="templateImage"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreviewUrl && (
              <img src={imagePreviewUrl} alt="Template Preview" style={{ marginTop: '10px', maxWidth: '100%' }} />
            )}
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleUpdate} disabled={loadingUpdate}>
          {loadingUpdate ? 'Updating...' : 'Update Template'}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateForm;
