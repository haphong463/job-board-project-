import React, { useEffect, useState, useRef } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewBox from '../../components/dialog-box/ReviewBox';
import WaveLoader from '../../components/loading-spinner/LoadingSpinner';
import '../../assets/css/review-template.css';
import { set } from 'react-hook-form';

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
      const response = await axiosRequest.get(`/templates/to-pdf/${key}/${userId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
 
  const handleUpdateCV = () => {
    navigate(`/update-cv/${cvId}`);
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
        <div className="col">
          {isLoading ? (
            <WaveLoader />
          ) : (
            <div className="template-preview" ref={templatePreviewRef}>
              <div dangerouslySetInnerHTML={{ __html: templateContent }} />
            </div>
          )}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
        <div className="actions-title text-center">Actions</div>
          <div className="actions-container d-flex flex-column flex-md-row justify-content-center align-items-center">
            
            <div className="action-items d-flex flex-wrap justify-content-center">
              <div className="action-item" onClick={handlePrintToPdf}>
                <span className="icon">🖨️</span>
                Print to PDF
              </div>
              <div className="separator">|</div>
              <div className="action-item" onClick={handleUpdateCV}>
                <span className="icon">✏️</span>
                Update CV
              </div>
              <div className="separator">|</div>
              <div className="action-item" onClick={handleGoBack}>
                <span className="icon">⬅️</span>
                Go Back
              </div>
              <div className="separator">|</div>

              <div className="action-item" onClick={scrollToTop}>
                <span>ScrollTop</span>
                <button
                  className={`scroll-to-top ${showScrollToTop ? 'show' : ''}`}
                >
                  &#8679;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateViewer;
