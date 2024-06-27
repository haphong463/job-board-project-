// src/pages/Quiz/Quiz.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { fetchQuizzesThunk } from '../../features/quizSlice';
import './Quiz.css';

export const Quiz = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quizzes.quizzes);
  const quizStatus = useSelector((state) => state.quizzes.status);

  useEffect(() => {
    const isAuthenticated = () => {
      return localStorage.getItem('accessToken') !== null;
    };

    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      setLoggedIn(true);
      if (quizStatus === 'idle') {
        dispatch(fetchQuizzesThunk());
      }
    }
  }, [navigate, dispatch, quizStatus]);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuiz(null);
  };

  const handleConfirmStart = () => {
    navigate(`/quiz/${selectedQuiz.id}`);
  };

  if (!loggedIn) {
    return null;
  }

  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{
            backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
          }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">JobBoard Skills</h1>
                <div className="custom-breadcrumbs">
                  <a href="/">Home</a> <span className="mx-2 slash">/</span>
                  <span className="text-white">
                    <strong>Quiz</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h2 className="mb-4 font-weight-bold">
                  Hệ thống đánh giá chất lượng kỹ năng ứng viên
                </h2>
                <p className="lead">
                  Khẳng định năng lực nghề nghiệp thông qua các bài thi đa dạng
                  chủ đề, từ đa dạng các ngành nghề. Hệ thống sẽ xác thực kỹ
                  năng dựa vào CV, từ đó giúp CV của bạn trở nên nổi bật trong
                  mắt nhà tuyển dụng và nâng cao tỷ lệ trúng tuyển tại các công
                  ty bạn mong muốn.
                </p>
                <button className="btn btn-primary">Tìm hiểu ngay</button>
              </div>
            </div>
            <div className="row mt-5">
              {quizzes.map((quiz) => (
                <div className="col-lg-4 mb-4" key={quiz.id}>
                  <div className="quiz-card border rounded p-4">
                    <img
                      src={quiz.imageUrl}
                      alt={quiz.title}
                      className="img-fluid mb-3"
                    />
                    <h3>{quiz.title}</h3>
                    <p>{quiz.description}</p>

                    <button
                      className="btn btn-success"
                      onClick={() => handleStartQuiz(quiz)}
                    >
                      Làm bài thi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: 'custom-dialog' }}
        >
          <DialogTitle className="custom-dialog-title">
            Thông tin bài đánh giá
          </DialogTitle>
          <DialogContent className="custom-dialog-content">
            {selectedQuiz && (
              <>
                <DialogContentText>
                  <h2>{selectedQuiz.title}</h2>

                  <div className="custom-dialog-description">
                    <p>Mô tả bài đánh giá</p>
                    <p>{selectedQuiz.description}</p>
                  </div>
                </DialogContentText>
              </>
            )}
          </DialogContent>
          <DialogActions className="custom-dialog-actions">
            <Button
              onClick={handleClose}
              color="primary"
              className="custom-dialog-button"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleConfirmStart}
              color="primary"
              className="custom-dialog-button"
            >
              Bắt đầu làm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </GlobalLayoutUser>
  );
};

export default Quiz;
