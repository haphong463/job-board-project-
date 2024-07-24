import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import "./Quiz.css"; // Import CSS

export const Quiz = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [attemptsInfo, setAttemptsInfo] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const isAuthenticated = () => {
      return localStorage.getItem("accessToken") !== null;
    };

    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      setLoggedIn(true);
      fetchCategoriesAndQuizzes();
      fetchCompletedQuizzes();
      const intervalId = setInterval(() => {
        fetchCategoriesAndQuizzes();
        fetchCompletedQuizzes();
      }, 10000); // Polling every 10 seconds

      return () => clearInterval(intervalId);
    }
  }, [navigate, user]);

  useEffect(() => {
    applyFilters();
  }, [categories, searchTerm, selectedStatus, filterCategory]);

  const fetchCategoriesAndQuizzes = () => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/categoriesquiz`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setCategories(response.data);
        response.data.forEach((category) => {
          category.quizzes.forEach((quiz) => {
            axios
              .get(
                `${process.env.REACT_APP_API_ENDPOINT}/quizzes/${quiz.id}/attempts`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  params: {
                    userId: user.id,
                  },
                }
              )
              .then((response) => {
                setAttemptsInfo((prev) => ({
                  ...prev,
                  [quiz.id]: response.data,
                }));
              })
              .catch((error) => {
                console.error(
                  "There was an error fetching the attempts info!",
                  error
                );
              });
          });
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  };

  const fetchCompletedQuizzes = () => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/quizzes/${user.id}/completed-quizzes`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setCompletedQuizzes(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the completed quizzes!",
          error
        );
      });
  };

  const handleStartQuiz = (quiz) => {
    const accessToken = localStorage.getItem("accessToken");
    const attemptsLeft = attemptsInfo[quiz.id]?.attemptsLeft || 0;
    const timeLeft = attemptsInfo[quiz.id]?.timeLeft || 0;

    if (attemptsLeft > 0 || timeLeft === 0) {
      setSelectedQuiz(quiz);
      setOpen(true);
    } else {
      alert(
        `You have reached the maximum number of attempts. Please wait for ${timeLeft} seconds to retake the quiz.`
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuiz(null);
  };

  const handleConfirmStart = () => {
    const accessToken = localStorage.getItem("accessToken");
    localStorage.removeItem(`questions_${selectedQuiz.id}`);
    localStorage.removeItem(`sessionId_${selectedQuiz.id}`);
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/quizzes/${selectedQuiz.id}/questions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            count: 10,
          },
        }
      )
      .then((response) => {
        const questions = response.data;
        localStorage.setItem(
          `questions_${selectedQuiz.id}`,
          JSON.stringify(questions)
        );
        navigate(`/quiz/${selectedQuiz.id}`);
      })
      .catch((error) => {
        console.error("There was an error fetching the questions!", error);
      });
  };

  const handleQuizCompletion = (quizId) => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/quizzes/${quizId}/complete`,
        {
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        fetchCategoriesAndQuizzes(); 
        fetchCompletedQuizzes(); 
      })
      .catch((error) => {
        console.error("There was an error completing the quiz!", error);
      });
  };

  const calculateNextAttemptDate = (seconds) => {
    const nextAttemptDate = new Date(Date.now() + seconds * 1000);
    return nextAttemptDate.toLocaleDateString("vi-VN");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const applyFilters = () => {
    let filtered = categories;
  
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (category) => category.name === filterCategory
      );
    }
  
    filtered = filtered.map((category) => {
      const filteredQuizzes = category.quizzes.filter((quiz) => {
        const matchesSearchTerm = searchTerm === "" || 
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
  
        const matchesStatus =
          selectedStatus === "all" ||
          (selectedStatus === "completed" &&
            completedQuizzes.includes(quiz.id)) ||
          (selectedStatus === "incomplete" &&
            !completedQuizzes.includes(quiz.id));
  
        return matchesSearchTerm && matchesStatus;
      });
      return { ...category, quizzes: filteredQuizzes };
    });
  
    setFilteredCategories(filtered);
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
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập từ khóa tìm kiếm"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-control"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  <option value="all">Tất cả</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="incomplete">Chưa hoàn thành</option>
                </select>
              </div>
              <div className="col-md-4">
                <select
                  className="form-control"
                  value={filterCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              {filteredCategories.map((category) => (
                <div key={category.id} className="col-md-12">
                  <h4>{category.name}</h4>
                  <div className="row">
                  {category.quizzes.map((quiz) => (
                    <div className="col-lg-4 mb-4" key={quiz.id}>
                      <div className="quiz-card border rounded p-4">
                        <img
                          src={quiz.imageUrl}
                          alt={quiz.title}
                          className="img-fluid mb-3"
                        />
                      <h3>{quiz.title}</h3>
                        <div className="quiz-details">
                        <div className="quiz-categories" >
                        {category.name|| "No Category"}
                            </div>
                          
                              <div className="quiz-candidates">
                              {quiz.numberOfUsers || 0}+ Số lần ứng viên làm bài thi
                            </div>
                         
                        </div>
                        {completedQuizzes.includes(quiz.id) ? (
                          <div className="alert alert-success">
                            Bạn đã hoàn thành quiz này.
                          </div>
                        ) : attemptsInfo[quiz.id]?.locked ? (
                          <div className="alert alert-warning">
                            Bạn đã hết lượt làm bài thi này. Hãy quay trở lại vào
                            ngày{" "}
                            {calculateNextAttemptDate(
                              attemptsInfo[quiz.id]?.timeLeft
                            )}
                            .
                          </div>
                        ) : (
                          <button
                            className="btn btn-success"
                            onClick={() => handleStartQuiz(quiz)}
                          >
                            Làm bài thi
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: "custom-dialog" }}
        >
          <DialogTitle className="custom-dialog-title">
            Thông tin bài đánh giá
          </DialogTitle>
          <DialogContent className="custom-dialog-content">
            {selectedQuiz && (
              <>
                <DialogContentText>
                  <div className="quiz-info">
                    <div className="info-item">
                      <i className="fas fa-book"></i>
                      <p>Chủ đề: {selectedQuiz.title}</p>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-question"></i>
                      <p>10 câu hỏi nhiều đáp án</p>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-clock"></i>
                      <p>10 phút làm bài</p>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-users"></i>
                      <p>
                        {selectedQuiz.numberOfUsers || 0}+ Số lần ứng viên đã
                        làm bài đánh giá này
                      </p>
                    </div>
                  </div>
                  <div className="custom-dialog-description">
                  <p><strong>Mô tả bài đánh giá</strong></p>
                  <p>{selectedQuiz.description}</p>
                    <p><strong>
                      Số lần làm bài còn lại:       </strong>  {" "}
                      {attemptsInfo[selectedQuiz.id]?.attemptsLeft}
                       </p> 
                    {attemptsInfo[selectedQuiz.id]?.timeLeft > 0 && (
                      <p>
                        Thời gian chờ: {attemptsInfo[selectedQuiz.id]?.timeLeft}{" "}
                        giây
                      </p>
                    )}
                  </div>
                </DialogContentText>
              </>
            )}
          </DialogContent>
          <DialogActions className="custom-dialog-actions">
            <Button
              onClick={handleClose}
              className="custom-dialog-button"
              color="primary"
            >
              Đóng
            </Button>
            <Button
              onClick={() => {
                handleConfirmStart();
                handleQuizCompletion(selectedQuiz.id);
              }}
              className="custom-dialog-button"
              color="primary"
              autoFocus
            >
              Bắt đầu làm bài
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </GlobalLayoutUser>
  );
};