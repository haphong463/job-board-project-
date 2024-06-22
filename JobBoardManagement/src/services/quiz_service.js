// api/quizzes.js
import axiosRequest from "../configs/axiosConfig";

const URL = "/quizzes"; // Adjust endpoint as per your QuizController mapping
const HEADERS_FORM_DATA = {
  "Content-Type": "multipart/form-data",
};

// Fetch all quizzes
export const getAllQuizzes = async () => {
  try {
    const response = await axiosRequest.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Create a new quiz
export const createQuiz = async (title, description, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("imageFile", imageFile);

    const response = await axiosRequest.post(`${URL}/createQuiz`, formData, {
      headers: HEADERS_FORM_DATA,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

// Delete a quiz by ID
export const deleteQuiz = async (quizId) => {
  try {
    await axiosRequest.delete(`${URL}/${quizId}`);
  } catch (error) {
    console.error(`Error deleting quiz with id ${quizId}:`, error);
    throw error;
  }
};

// Update a quiz by ID
export const updateQuiz = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append("quiz", JSON.stringify(data));

    const response = await axiosRequest.put(`${URL}/${id}`, formData, {
      headers: HEADERS_FORM_DATA,
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating quiz with id ${id}:`, error);
    throw error;
  }
};
