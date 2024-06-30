import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import {
  fetchQuizDetailsThunk,
  fetchQuizQuestionsThunk,
  submitQuizThunk,
} from "../../features/quizSlice";
import "./QuizQuestions.css";
import axiosRequest from "../../configs/axiosConfig";
import axios from "axios";

const QuizQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    quizTitle,
    questions,
    status,
    error,
    score,
    totalQuestions,
  } = useSelector((state) => state.quiz);
  const user = useSelector((state) => state.auth.user); // Assuming you have stored user information in Redux

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [showModal, setShowModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  useEffect(() => {
    dispatch(fetchQuizDetailsThunk(quizId));
    dispatch(fetchQuizQuestionsThunk(quizId));

    const savedTimeLeft = localStorage.getItem(`timeLeft_${quizId}`);
    if (savedTimeLeft) {
      setTimeLeft(parseInt(savedTimeLeft, 10));
    }

    const savedAnswers = localStorage.getItem(`selectedAnswers_${quizId}`);
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowTimeUpModal(true);
          handleSubmitQuiz();
          return 0;
        }
        localStorage.setItem(`timeLeft_${quizId}`, prevTime - 1);
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizId, dispatch]);

  useEffect(() => {
    localStorage.setItem(`selectedAnswers_${quizId}`, JSON.stringify(selectedAnswers));
  }, [selectedAnswers, quizId]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswerSelect = (questionId, answer) => {
    const updatedAnswers = {
      ...selectedAnswers,
      [questionId]: answer,
    };
    setSelectedAnswers(updatedAnswers);
  };
  const handleSubmitQuiz = async () => {
    const submission = {
        quizId: parseInt(quizId),
        userId: user.id,
        questions: Object.keys(selectedAnswers).map((questionId) => ({
            questionId: parseInt(questionId),
            selectedAnswer: selectedAnswers[questionId].split(".")[0].trim(),
            userAnswer: selectedAnswers[questionId],
        })),
    };

    try {
        console.log("Submitting quiz with data:", submission);
        const response = await axiosRequest.post(`/quizzes/submit`, submission);

        // Debug: Log the full response
        console.log("Full response from server:", response);

        if (response) {
            const { results, score } = response;
            console.log("Results:", results);
            console.log("Score:", score);

            // Ensure results and score are present
            if (Array.isArray(results) && typeof score === 'number') {
                console.log("Valid response data:", response);

                setShowModal(false);
                setShowScoreModal(true);
                localStorage.removeItem(`timeLeft_${quizId}`);
                localStorage.removeItem(`selectedAnswers_${quizId}`);
                navigate(`/quiz/${quizId}/result`, {
                    state: {
                        results: results,
                        totalQuestions: questions.length,
                        score: score,
                        quizId: quizId, 
                    },
                });
            } else {
                console.error("Unexpected response structure:", response);
            }
        } else {
            console.error("No data received:", response);
        }
    } catch (error) {
        console.error("Error submitting quiz:", error);
    }
};
  const handleExitQuiz = () => {
    setShowExitConfirmModal(true);
  };

  const handleConfirmExit = () => {
    localStorage.removeItem(`timeLeft_${quizId}`);
    localStorage.removeItem(`selectedAnswers_${quizId}`);
    navigate("/quiz");
  };

  const handleCancelExit = () => {
    setShowExitConfirmModal(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseTimeUpModal = () => {
    setShowTimeUpModal(false);
    setShowScoreModal(true);
    handleSubmitQuiz();
  };

  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
  };

  const getUnansweredQuestionsCount = () => {
    const unansweredCount = questions.filter(
      (question) => !selectedAnswers[question.id]
    ).length;
    return unansweredCount;
  };

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
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-12">
              <div className="quiz-header">
                <h2 className="mb-4">Bài thi {quizTitle}</h2>
                <div className="timer">
                  Thời gian làm bài kiểm tra còn lại:{" "}
                  <strong>{formatTime(timeLeft)}</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  {questions.length > 0 ? (
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Câu hỏi {currentQuestionIndex + 1}: {questions[currentQuestionIndex].questionText}</h5>
                        <ul className="list-group list-group-flush">
                          {(questions[currentQuestionIndex].options || "")
                            .split(",")
                            .map((opt, idx) => (
                              <li className="list-group-item" key={idx} onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, opt)}>
                                <label>
                                  <input
                                    type="radio"
                                    name={`question_${questions[currentQuestionIndex].id}`}
                                    value={opt}
                                    checked={
                                      selectedAnswers[
                                        questions[currentQuestionIndex].id
                                      ] === opt
                                    }
                                    onChange={() =>
                                      handleAnswerSelect(
                                        questions[currentQuestionIndex].id,
                                        opt
                                      )
                                    }
                                  />
                                  {opt}
                                </label>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p>Loading questions...</p>
                  )}
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-primary"
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="question-list card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Danh sách câu hỏi</h5>
                      <ul className="list-group list-group-flush">
                        {questions.map((question, index) => (
                          <li
                            key={question.id}
                            className={`list-group-item ${
                              index === currentQuestionIndex ? "active" : ""
                            } ${
                              selectedAnswers[question.id]
                                ? "answered"
                                : "unanswered"
                            }`}
                            onClick={() => handleQuestionClick(index)}
                          >
                            {index + 1}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="summary card">
                    <div className="card-body">
                      <p>
                        Số câu hỏi chưa trả lời:{" "}
                        <strong>{getUnansweredQuestionsCount()}</strong>
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={handleOpenModal}
                      >
                        Nộp bài kiểm tra
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={handleExitQuiz}
                      >
                        Thoát
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Nộp bài kiểm tra</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Bạn có chắc chắn muốn nộp bài kiểm tra? Bạn sẽ không thể thay
                  đổi câu trả lời sau khi đã nộp bài.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Hủy
                  </Button>
                  <Button variant="primary" onClick={handleSubmitQuiz}>
                    Nộp bài
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showTimeUpModal} onHide={handleCloseTimeUpModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Time's up!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Thời gian làm bài kiểm tra đã hết. Bài kiểm tra của bạn sẽ
                  được nộp tự động.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleCloseTimeUpModal}>
                    OK
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showScoreModal} onHide={handleCloseScoreModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Kết quả bài kiểm tra</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Bạn đã hoàn thành bài kiểm tra.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleCloseScoreModal}>
                    OK
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal
                show={showExitConfirmModal}
                onHide={handleCancelExit}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Xác nhận thoát</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Bạn có chắc chắn muốn thoát bài kiểm tra? Tiến trình của bạn sẽ không được lưu lại.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCancelExit}>
                    Hủy
                  </Button>
                  <Button variant="danger" onClick={handleConfirmExit}>
                    Thoát
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </>
    </GlobalLayoutUser>
  );
};

export default QuizQuestions;
