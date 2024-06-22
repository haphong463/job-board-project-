import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import "./QuizQuestions.css";

const QuizQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10 * 60); 
  const [showModal, setShowModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [score, setScore] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const REACT_APP_API_ENDPOINT =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8080/api";

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const quizResponse = await axios.get(
          `${REACT_APP_API_ENDPOINT}/quizzes/${quizId}`
        );
        setQuizTitle(quizResponse.data.title);

        const questionsResponse = await axios.get(
          `${REACT_APP_API_ENDPOINT}/quizzes/${quizId}/questions`
        );
        setQuestions(questionsResponse.data);
        setTotalQuestions(questionsResponse.data.length); 
        
      } catch (error) {
        console.error("Error fetching quiz details:", error);
      }
    };

    fetchQuizDetails();

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
  }, [quizId, REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    localStorage.setItem(
      `selectedAnswers_${quizId}`,
      JSON.stringify(selectedAnswers)
    );
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
      questions: Object.keys(selectedAnswers).map((questionId) => ({
        questionId: parseInt(questionId),
        selectedAnswer: selectedAnswers[questionId].split(".")[0].trim(),
      })),
    };

    try {
      const response = await axios.post(`${REACT_APP_API_ENDPOINT}/quizzes/submit`, submission);

      if (response.data && Array.isArray(response.data)) {
        const results = response.data;
        setShowModal(false);
        setShowScoreModal(true);
        setScore(calculateScore(results));
        localStorage.removeItem(`timeLeft_${quizId}`);
        localStorage.removeItem(`selectedAnswers_${quizId}`);
        navigate(`/quiz/${quizId}/result`, {
          state: {
            results: results,
            totalQuestions: questions.length,
            quizId: quizId 
          },
        });
      } else {
        console.error("Unexpected response data:", response.data);
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

  const calculateScore = (results) => {
    const correctAnswersCount = results.filter(
      (result) => result.selectedAnswer === result.correctAnswer
    ).length;
    const percentage = (correctAnswersCount / totalQuestions) * 100;
    return percentage.toFixed(2);
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
              {questions.length > 0 ? (
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{`Câu hỏi ${
                      currentQuestionIndex + 1
                    }: ${questions[currentQuestionIndex].questionText}`}</h5>
                    <ul className="list-group list-group-flush">
                      {(questions[currentQuestionIndex].options || "")
                        .split(",")
                        .map((opt, idx) => (
                          <li className="list-group-item" key={idx}>
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
              <div className="quiz-navigation">
                <button
                  className="btn btn-secondary mr-2"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Câu Hỏi Trước
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Câu Hỏi Tiếp Theo
                </button>
              </div>
              <button
                className="btn btn-success mt-3 mr-3"
                onClick={handleOpenModal}
              >
                Nộp Bài Thi
              </button>
              <button className="btn btn-danger mt-3" onClick={handleExitQuiz}>
                Thoát Bài Thi
              </button>          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nộp bài</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {getUnansweredQuestionsCount() > 0 ? (
            `Đề thi còn ${getUnansweredQuestionsCount()} câu chưa hoàn thành, bạn có chắc chắn muốn nộp bài không?`
          ) : (
            "Bạn đã trả lời hết các câu hỏi, bạn có muốn nộp bài không?"
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmitQuiz}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTimeUpModal} onHide={handleCloseTimeUpModal}>
        <Modal.Header closeButton>
          <Modal.Title>Hết thời gian!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Thời gian làm bài đã hết.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseTimeUpModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showScoreModal} onHide={handleCloseScoreModal}>
        <Modal.Header closeButton>
          <Modal.Title>Kết quả bài thi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {score && <p>Điểm số của bạn là: {score}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseScoreModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showExitConfirmModal} onHide={handleCancelExit}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thoát</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn thoát khỏi bài thi giữa chừng không?
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
    </>
  </GlobalLayoutUser>
);
}

export default QuizQuestions;
