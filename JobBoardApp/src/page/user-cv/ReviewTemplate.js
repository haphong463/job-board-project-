import React, { useEffect, useState, useRef } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewBox from '../../components/dialog-box/ReviewBox';
import WaveLoader from '../../components/loading-spinner/LoadingSpinner';
import '../../assets/css/review-template.css';

const CVSelector = ({ cvs, currentCvId, onCVChange }) => (
  <div className='text-center'>
    <h3 className='text-review-css'>Click to change cv details</h3>
    <div className="action-item-rv cv-selector-item">
      <div className="cv-selector-container">
        <select
          value={currentCvId}
          onChange={(e) => onCVChange(e.target.value)}
          className="cv-selector"
        >
          <option value="" disabled selected>Select a CV</option>
          {cvs.map(cv => (
            <option key={cv.cvId} value={cv.cvId}>{cv.cvTitle}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

const TemplateViewer = () => {
  const { templateName: key, cvId } = useParams();
  const [templateContent, setTemplateContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector(state => state.auth.user.id);
  const navigate = useNavigate();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const templatePreviewRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [userCVs, setUserCVs] = useState([]);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await axiosRequest.get(`/templates/review-template/${key}/${userId}/${cvId}`);
      setTemplateContent(response);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCVs = async () => {
    try {
      const response = await axiosRequest.get(`/usercv/list-cvs/${userId}`);
      setUserCVs(response);
    } catch (error) {
      console.error('Error fetching user CVs:', error);
    }
  };
  const handlePrintToPdf = async () => {
    try {
      const cvTitle = userCVs.find(cv => cv.cvId === parseInt(cvId))?.cvTitle || 'cv_template';

      // Generate PDF
      const response = await axiosRequest.get(`/templates/generate/${userId}/${cvId}`, {
        responseType: 'blob',
      });

      if (!(response instanceof Blob)) {
        throw new Error('Invalid response: expected Blob');
      }

      // Create URL for downloading
      const pdfUrl = URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${cvTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Convert Blob to ArrayBuffer to byte[]
      const pdfData = await response.arrayBuffer();
      const byteArray = new Uint8Array(pdfData);

      // Prepare FormData for saving the PDF
      const formData = new FormData();
      formData.append('name', `${cvTitle}.pdf`);
      formData.append('fileData', new Blob([byteArray], { type: 'application/pdf' }));

      // Save the PDF to the database
      await axiosRequest.post(`/templates/pdf-document/save/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    } catch (error) {
      console.error('Error generating or saving PDF:', error);
      alert(`Error generating or saving PDF: ${error.message}`);
    }
  };



  const handleUpdateCV = () => {
    navigate(`/cv-management`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    setShowDialog(true);
    fetchTemplate();
    fetchUserCVs();
  }, [key, userId, cvId]);

  const handleCVChange = async (newCvId) => {
    try {
      setIsLoading(true);
      const response = await axiosRequest.get(`/templates/review-template/${key}/${userId}/${newCvId}`);
      setTemplateContent(response);
      navigate(`/review-template/${key}/${userId}/${newCvId}`, { replace: true });
    } catch (error) {
      console.error('Error changing CV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = templatePreviewRef.current.scrollTop;
      setShowScrollToTop(scrollHeight > 300);
    };

    const templatePreviewElement = templatePreviewRef.current;
    if (templatePreviewElement) {
      templatePreviewElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (templatePreviewElement) {
        templatePreviewElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    const templatePreviewElement = templatePreviewRef.current;
    if (templatePreviewElement) {
      templatePreviewElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="container-fluid">
        <ReviewBox isOpen={showDialog} onClose={handleCloseDialog} />
      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="actions-container-rv">
            <div className="actions-title text-center">Actions</div>
            <hr className='hr-review-css m-2'/>
            <div className="action-items-rv d-flex flex-column">
              <div className="action-item-rv cv-selector-item">
                <CVSelector
                  cvs={userCVs}
                  currentCvId={cvId}
                  onCVChange={handleCVChange}
                />
              </div>

              <div className="action-item-rv" onClick={handlePrintToPdf}>
                <span className="icon"><i className="fas fa-print"></i></span>
                Print to PDF
              </div>
              <div className="action-item-rv" onClick={handleUpdateCV}>
                <span className="icon"><i className="fas fa-edit"></i></span>
                Update CV
              </div>
              <div className="action-item-rv" onClick={handleGoBack}>
                <span className="icon"><i className="fas fa-arrow-left"></i></span>
                Go Back
              </div>
              <div className="action-item-rv" onClick={scrollToTop}>
                <span className="icon"><i className="fas fa-arrow-up"></i></span>
                ScrollTop
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          {isLoading ? (
            <WaveLoader />
          ) : (
            <div className="template-preview" ref={templatePreviewRef}>
              <div dangerouslySetInnerHTML={{ __html: templateContent }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateViewer;
