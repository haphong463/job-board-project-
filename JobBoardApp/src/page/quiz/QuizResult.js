import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { fetchQuizResultsThunk } from "../../features/quizSlice";
import "./QuizResult.css";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { results, totalQuestions, quizId, score, status, error } = location.state || {};

  useEffect(() => {
    if (location.state && location.state.quizId) {
      dispatch(fetchQuizResultsThunk(location.state.quizId));
    }
  }, [location.state, dispatch]);

  const correctAnswersCount = results
    ? results.filter((result) => result.selectedAnswer === result.correctAnswer).length
    : 0;
  const percentage = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2) : 0;

  const handleRetry = () => {
    if (quizId) {
      navigate(`/quiz/${quizId}`); // Chuyển hướng lại đến bài quiz để retry
    } else {
      console.error('No quizId found in location.state:', location.state);
    }
  };


  const handleGoBack = () => {
    navigate('/quiz');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <GlobalLayoutUser>
      <>
        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v13.0&appId=YOUR_APP_ID&autoLogAppEvents=1" nonce="YOUR_NONCE"></script>

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
            <p>{score}%</p>
            <p>{score < 50 ? "Bạn cần học thêm nhiều hơn!" : "Tốt lắm, tiếp tục phát huy!"}</p>
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
