import React, { useEffect, useState, useRef } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewBox from '../../components/dialog-box/ReviewBox';
import WaveLoader from '../../components/loading-spinner/LoadingSpinner';
import '../../assets/css/review-template.css';


const TemplateViewer = () => {
  const { templateName: key } = useParams();
  const [templateContent, setTemplateContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector(state => state.auth.user.id);
  const navigate = useNavigate();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const templatePreviewRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [cvId, setcvId] = useState('');
  
  const handlePrintToPdf = async () => {
    try {
      // Generate PDF
      const response = await axiosRequest.get(`/templates/generate/${userId}`, {
        responseType: 'blob',
      });
  
      if (!(response instanceof Blob)) {
        throw new Error('Invalid response: expected Blob');
      }
  
      // Create URL for downloading
      const pdfUrl = URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'cv_template.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
  
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
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        const response = await axiosRequest.get(`/templates/review-template/${key}/${userId}`);
        setTemplateContent(response);
        setcvId(response.cvId);
      } catch (error) {
        console.error('Error fetching template:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [key, userId]);

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
            <div className="action-items-rv d-flex flex-column">
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
