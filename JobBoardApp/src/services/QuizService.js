import axiosRequest from "../configs/axiosConfig";

export const getQuizzes = () => {
  return axiosRequest.get('/quizzes');
};