import React, { useState, useEffect } from 'react';
import axiosRequest from "../../configs/axiosConfig";

const CreateTemplate = () => {
    const [uploadTemplateName, setUploadTemplateName] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [createTemplateName, setCreateTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [templateFilePath, setTemplateFilePath] = useState('');
    const [templateImage, setTemplateImage] = useState(null);
    const [createFile, setCreateFile] = useState(null);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [createMessage, setCreateMessage] = useState('');
    const [createButtonDisabled, setCreateButtonDisabled] = useState(true); // Initially disable Create button
    const [uploadFormDisabled, setUploadFormDisabled] = useState(false); // Initially enable Upload form

    useEffect(() => {
        setCreateTemplateName(uploadTemplateName);
    }, [uploadTemplateName]);

    const handleFileChangeUpload = (e) => {
        setUploadFile(e.target.files[0]);
    };

    const handleFileChange = (e) => {
        setTemplateImage(e.target.files[0]); // Set the selected file to state
    };

    const handleSubmitUpload = async (e) => {
        e.preventDefault();
        setLoadingUpload(true);

        try {
            const formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('templateName', uploadTemplateName);

            const response = await axiosRequest.post('/templates/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadMessage(response.message);
            setLoadingUpload(false);

            // Enable Create button and set Template File Path
            setCreateButtonDisabled(false);
            setTemplateFilePath(`http://localhost:8080/api/templates/${uploadTemplateName}`);

            // Disable Upload form after successful upload
            setUploadFormDisabled(true);
        } catch (error) {
            setUploadMessage('Error uploading template: ' + error.message);
            setLoadingUpload(false);
        }
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        setLoadingCreate(true);

        try {
            const formData = new FormData();
            formData.append('file', createFile); // Append the file here
            formData.append('templateName', createTemplateName);
            formData.append('templateDescription', templateDescription);
            formData.append('templateFilePath', templateFilePath);
            formData.append('templateImage', templateImage);
            const response = await axiosRequest.post('/templates/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setCreateMessage(response.message);
            setLoadingCreate(false);
        } catch (error) {
            setCreateMessage('Error creating template: ' + error.message);
            setLoadingCreate(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Combined Template Actions</h1>

            {/* Upload Template Form */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="card-title">Upload Template</h5>
                </div>
                <div className="card-body">
                    {/* Upload message */}
                    {uploadMessage && <div className="alert alert-info">{uploadMessage}</div>}
                    {/* Upload form */}
                    <form onSubmit={handleSubmitUpload}>
                        <div className="form-group">
                            <label htmlFor="templateNameUpload">Key - Template name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="templateNameUpload"
                                value={uploadTemplateName}
                                onChange={(e) => setUploadTemplateName(e.target.value)}
                                required
                                disabled={uploadFormDisabled}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fileUpload">Upload HTML File:</label>
                            <input
                                type="file"
                                className="form-control-file"
                                id="fileUpload"
                                onChange={handleFileChangeUpload}
                                accept=".html"
                                required
                                disabled={uploadFormDisabled}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loadingUpload || uploadFormDisabled}>
                            {loadingUpload ? 'Uploading...' : 'Upload Template'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Create Template Form */}
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Create Template</h5>
                </div>
                <div className="card-body">
                    {/* Create message */}
                    {createMessage && <div className="alert alert-info">{createMessage}</div>}
                    {/* Create form */}
                    <form onSubmit={handleSubmitCreate}>
                        <div className="form-group">
                            <input
                                hidden
                                type="text"
                                className="form-control"
                                id="templateNameCreate"
                                value={createTemplateName}
                                onChange={(e) => setCreateTemplateName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="templateDescription">Template Description:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="templateDescription"
                                value={templateDescription}
                                onChange={(e) => setTemplateDescription(e.target.value)}
                                
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="templateFilePath">Template File Path (URL):</label>
                            <input
                                type="text"
                                className="form-control"
                                id="templateFilePath"
                                value={templateFilePath || `http://localhost:8080/api/templates/${createTemplateName}`}
                                onChange={(e) => setTemplateFilePath(e.target.value)}
                                required
                                readOnly
                                
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="templateImage">Upload Template Image:</label>
                            <input
                                type="file"
                                className="form-control-file"
                                id="templateImage"
                                onChange={handleFileChange}
                                accept="image/*"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loadingCreate || createButtonDisabled}>
                            {loadingCreate ? 'Creating...' : 'Create Template'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTemplate;
