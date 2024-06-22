import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import "./QuizResult.css";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure the state is properly logged for debugging
  console.log("Location state:", location.state);

  const { results, totalQuestions, quizId } = location.state || {};
  const correctAnswersCount = results
    ? results.filter((result) => result.selectedAnswer === result.correctAnswer).length
    : 0;
  const percentage = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2) : 0;

  const handleRetry = () => {
    if (quizId) {
      navigate(`/quiz/${quizId}`);
    } else {
      console.error("No quizId found in location.state:", location.state);
    }
  };

  const handleGoBack = () => {
    navigate('/quiz');
  };

  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{ backgroundImage: 'url("../../../../assets/images/hero_1.jpg")' }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">JobBoard Skills</h1>
                <div className="custom-breadcrumbs">
                  <a href="/">Home</a> <span className="mx-2 slash">/</span>
                  <span className="text-white"><strong>Quiz</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="result-container">
          <h2>Kết quả bài thi</h2>
          <div className="result-score">
            <p>Câu trả lời đúng: {correctAnswersCount} / {totalQuestions}</p>
            <p>{percentage}%</p>
            <p>{percentage < 50 ? "Bạn cần học thêm nhiều hơn!" : "Tốt lắm, tiếp tục phát huy!"}</p>
          </div>
          <div className="result-actions">
            <button className="btn btn-primary" onClick={handleRetry}>Làm lại bài đánh giá</button>
            <button className="btn btn-secondary" onClick={handleGoBack}>Quay lại trang danh sách kỹ năng</button>
          </div>
        </div>
      </>
    </GlobalLayoutUser>
  );
};

export default QuizResult;
