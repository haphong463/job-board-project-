import React, { useState, useEffect } from 'react';
import axiosRequest from "../../configs/axiosConfig";
import CreateCv from './CreateCv';
import CvList from './CvList';
import ListPdf from '../pdf-management/ListPdf';
import DetailsCv from './DetailsCv';
import ApplyBox from '../../components/dialog-box/Applybox';
import { useSelector } from 'react-redux';
import './css/main.css';
import { Link } from 'react-router-dom';
function MainCv() {
  const [currentAction, setCurrentAction] = useState('default');
  const user = useSelector(state => state.auth.user);
  const [notification, setNotification] = useState(null);
  const [hasCVs, setHasCVs] = useState(false);
  const [deleteQuestion, setDeleteQuestion] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  // useEffect(() => {
  //   checkHasCVs(); // Check if the user has CVs initially
  // }, []);

  // const checkHasCVs = async () => {
  //   try {
  //     const response = await axiosRequest.get(`/usercv/check-cvs/${user.id}`);
  //     setHasCVs(response);
  //     console.log(response) // Assuming server returns true/false
  //   } catch (error) {
  //     console.error('Error checking CVs:', error);
  //     setHasCVs(false); // Set to false by default or handle error state
  //   }
  // };







  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000); // Notification will disappear after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const renderNotification = () => {
    if (notification) {
      return (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      );
    }
    return null;
  };

  const renderDisplayArea = () => {
    return (
      <>
        {renderNotification()}
        {(() => {
          switch (currentAction) {
            case 'create':
              return <CreateCv />;
            case 'cvHis':
              return <ListPdf />;
            case 'cvDetails':
              return <CvList />;
            case 'box':
              return <ApplyBox />;
            case 'delete':
              return (
                <DeleteCv
                  userId={user.id}
                  onDelete={(message, type = 'success') => setNotification({ type, message })}
                  onCancel={() => setCurrentAction('default')}
                />
              );
            default:
              return (
                <div className="default-info">
                  <div className="welcome-overlay">
                    <h2 className='welcome fade-in'>Welcome back <i className='userName'>{user.lastName}</i>!</h2>
                  </div>
                </div>
              );
          }
        })()}
      </>
    );
  };

  return (
    <div className="main-cv-wrapper">
      <section className='p-4'>
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="green-text font-weight-bold">CV Management</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white font-weight-bold">
                  CV Management
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="main-cv-container">
        <div className="actions-container">
          <h2>Local Actions</h2>
          <div className={`action-item ${currentAction === 'create' ? 'active' : ''}`} onClick={() => setCurrentAction('create')}>
            <i className="fas fa-plus mr-2"></i> Create CV
          </div>
          <div className={`action-item ${currentAction === 'cv details' ? 'active' : ''}`} onClick={() => setCurrentAction('cvDetails')}>
            <i className="fas fa-info-circle mr-2"></i> CV Details
          </div>
          <div className={`action-item ${currentAction === 'cv history' ? 'active' : ''}`} onClick={() => setCurrentAction('cvHis')}>
            <i className="fas fa-history mr-2"></i> CV History
          </div>
          <div className={`action-item ${currentAction === 'view' ? 'active' : ''}`} onClick={() => setCurrentAction('box')}>
            <i className="fas fa-box mr-2"></i> Box
          </div>

          <hr style={{
            backgroundColor: 'black',
            width: '100%',

          }} />
          <h2 className='mt-3'>Global Actions</h2>
          <Link to="/list-template" >
            <div className="global-action-item">
              <i className="fas fa-list mr-2"></i> To List Template
            </div>
          </Link>
          <Link to="/quiz" >
            <div className="global-action-item">
              <i className="fas fa-question-circle mr-2"></i> To Quiz
            </div>
          </Link>
          <Link to="/blog">
            <div className="global-action-item">
              <i className="fas fa-blog mr-2"></i> To Blog
            </div>
          </Link>
          <Link to="/jobs" >
            <div className="global-action-item">
              <i className="fas fa-list-ul mr-2"></i> To Job List
            </div>
          </Link>

        </div>

        <div className="display-area">
          {renderDisplayArea()}
        </div>
      </div>
    </div>
  );
}

export default MainCv;
