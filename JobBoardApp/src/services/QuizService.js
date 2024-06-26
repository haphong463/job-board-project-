import axiosRequest from "../configs/axiosConfig";

export const getAllQuizzes = async () => await axiosRequest.get("/quizzes");