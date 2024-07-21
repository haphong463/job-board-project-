import React, { useState, useEffect } from 'react';
import axiosRequest from "../../configs/axiosConfig";
import CreateCv from './CreateCv';
import UpdateCv from './UpdateCv';
import DetailsCv from './DetailsCv';
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

  useEffect(() => {
    checkHasCVs(); // Check if the user has CVs initially
  }, []);

  const checkHasCVs = async () => {
    try {
      const response = await axiosRequest.get(`/usercv/check-cvs/${user.id}`);
      setHasCVs(response);
      console.log(response) // Assuming server returns true/false
    } catch (error) {
      console.error('Error checking CVs:', error);
      setHasCVs(false); // Set to false by default or handle error state
    }
  };
  const generateRandomQuestion = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;

    let question, answer;

    switch (operation) {
      case '+':
        question = `What is ${num1} + ${num2}?`;
        answer = (num1 + num2).toString();
        break;
      case '-':
        question = `What is ${num1} - ${num2}?`;
        answer = (num1 - num2).toString();
        break;
      case '*':
        question = `What is ${num1} * ${num2}?`;
        answer = (num1 * num2).toString();
        break;
    }

    return { question, answer };
  };

  const deleteCv = () => {
    const randomQ = generateRandomQuestion();
    setDeleteQuestion(randomQ);
    setShowQuestionForm(true);
    setWrongAttempts(0); // Reset wrong attempts
  };
  

  const handleAnswerSubmit = (userAnswer) => {
    if (userAnswer === deleteQuestion.answer) {
      confirmDelete();
    } else {
      const newWrongAttempts = wrongAttempts + 1;
      setWrongAttempts(newWrongAttempts);
      
      if (newWrongAttempts >= 3) {
        setNotification({ type: 'error', message: 'Too many incorrect attempts. Delete operation cancelled.' });
        setDeleteQuestion(null);
        setShowQuestionForm(false);
        setWrongAttempts(0);
      } else {
        setNotification({ type: 'error', message: `Incorrect answer. Try again. (Attempt ${newWrongAttempts}/3)` });
        setDeleteQuestion(generateRandomQuestion());
      }
    }
  };
  

  const confirmDelete = async () => {
    try {
      await axiosRequest.delete(`/usercv/delete-cv/${user.id}`);
      setNotification({ type: 'success', message: 'CVs deleted successfully!' });
      setHasCVs(false);
    } catch (error) {
      console.error('Error deleting CVs:', error);
      setNotification({ type: 'error', message: 'Failed to delete CVs. Please try again.' });
    }
    setDeleteQuestion(null);
    setShowQuestionForm(false);
  };

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
              return hasCVs ? (
                <h3 style={{
                  fontFamily: 'Poppins',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#02871c',
                  padding: '20px',
                  margin: '30px 0',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  letterSpacing: '0.5px'
                }}>You already have a CV. Please go to the <Link to="/list-template" ><i className='render-css'> list template page</i></Link> or <i className='render-css' onClick={() => setCurrentAction('update')}>update your existing CV.</i></h3>
              ) : (
                <CreateCv />
              );
            case 'view':
              return <DetailsCv />;
            case 'update':
              return <UpdateCv />;
            case 'delete':
              return (
                <div className="delete-confirmation">
                  {hasCVs ? (
                    <>
                      <h2><i className="fas fa-exclamation-triangle mr-2"></i> Delete Confirmation</h2>
                      {!showQuestionForm ? (
                        <>
                          <p>Are you sure you want to delete all your CV's information?</p>
                          <button className="confirm-btn" onClick={deleteCv}>Confirm Delete</button>
                        </>
                      ) : (
                        <div className="question-form">
                          <p className="text-danger">*Answer the following question to confirm delete:</p>
                          <p>{deleteQuestion.question}</p>
                          <input type="text" id="deleteAnswer" placeholder="Your answer" />
                          <button className="confirm-btn" onClick={() => handleAnswerSubmit(document.getElementById('deleteAnswer').value)}>
                            Submit Answer
                          </button>
                          <button className="cancel-btn" onClick={() => {
                            setShowQuestionForm(false);
                            setDeleteQuestion(null);
                          }}>Cancel</button>

                        </div>
                      )}

                    </>
                  ) : (
                    <h3 style={{
                      fontFamily: 'Poppins',
                      textAlign: 'center',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#c62828',
                      padding: '20px',
                      margin: '30px 0',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                      letterSpacing: '0.5px'
                    }}>You don't have any CVs to delete!</h3>
                  )}
                </div>
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
              <h1 className="text-white font-weight-bold">CV Management</h1>
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
          <div className={`action-item ${currentAction === 'view' ? 'active' : ''}`} onClick={() => setCurrentAction('view')}>
            <i className="fas fa-eye mr-2"></i> View CV
          </div>
          <div className={`action-item ${currentAction === 'update' ? 'active' : ''}`} onClick={() => setCurrentAction('update')}>
            <i className="fas fa-edit mr-2"></i> Update CV
          </div>
          <div className={`action-item ${currentAction === 'delete' ? 'active' : ''}`} onClick={() => setCurrentAction('delete')}>
            <i className="fas fa-trash mr-2"></i> Delete CV
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
