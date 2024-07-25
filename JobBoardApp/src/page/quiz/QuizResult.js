import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { fetchQuizResultsThunk } from "../../features/quizSlice";
import "./QuizResult.css";
import successImage from "../../assets/images/Do-hoa-02.png";
import badImage from "../../assets/images/fail-1.png";

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

  const images = {
    success: successImage,
    bad: badImage,
  };

  let message;
  let image;

  if (score <= 7) {
    image = images.bad;
    message = `Bạn chưa nhận được chứng chỉ của hệ thống do chưa lọt Top 20% ứng viên xuất sắc nhất . Đừng nản chí, bạn vẫn còn 1 lần làm lại bài đánh giá. Hãy cố gắng vượt qua nhé!`;
  } else {
    image = images.success;
    message = `Chúc mừng bạn đã xuất sắc vượt qua bài đánh giá và lọt vào Top 20% ứng viên! 🎉
Bạn đã hoàn thành tất cả các yêu cầu và chứng tỏ được sự xuất sắc của mình.
Chúng tôi rất vui mừng thông báo rằng bạn đã nhận được chứng chỉ của hệ thống.
Chúc bạn tiếp tục thành công trên con đường sự nghiệp của mình!`;
  }

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
        <div class="container">

        <div className="quiz-result-container">
          <h2>Kết quả bài thi</h2>
          <div className="result-score">
            <img src={image} alt="result" className="result-image" />
            <p className="result-message">{message.split('\n').map((line, index) => (
              <React.Fragment key={index}>{line}<br /></React.Fragment>
            ))}</p>
          </div>
          <div className="result-actions">
            <button className="btn btn-secondary" onClick={handleGoBack}>Quay lại trang danh sách kỹ năng</button>
          </div>
        </div>
        </div>
      </>
    </GlobalLayoutUser>
  );
};

export default QuizResult;
