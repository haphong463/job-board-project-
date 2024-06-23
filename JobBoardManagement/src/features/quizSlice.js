import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllQuizzes,
  createQuiz as createQuizAsync,
  deleteQuiz as deleteQuizAsync,
  updateQuiz as updateQuizAsync,
} from "../services/quiz_service";

// Async thunk to fetch all quizzes

export const fetchQuizzes = createAsyncThunk("quizzes/fetchQuizzes", async () => {
  try {
    const response = await getAllQuizzes();
    return response;
  } catch (error) {
    throw new Error("Error fetching quizzes");
  }
});

// Async thunk to add a new quiz
export const addQuiz = createAsyncThunk("quizzes/addQuiz", async (data) => {
  try {
    const { title, description, imageFile } = data;
    const response = await createQuizAsync(title, description, imageFile);
    return response;
  } catch (error) {
    throw new Error("Error creating quiz");
  }
});

// Async thunk to delete a quiz by ID
export const deleteQuiz = createAsyncThunk("quizzes/deleteQuiz", async (id) => {
  try {
    await deleteQuizAsync(id);
    return id;
  } catch (error) {
    throw new Error(`Error deleting quiz with id ${id}`);
  }
});

// Async thunk to update a quiz by ID
export const updateQuiz = createAsyncThunk("quizzes/updateQuiz", async ({ id, data }) => {
  try {
    const response = await updateQuizAsync(id, data);
    return response;
  } catch (error) {
    throw new Error(`Error updating quiz with id ${id}`);
  }
});

const quizSlice = createSlice({
  name: "quizzes",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addQuiz.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.list = state.list.filter((quiz) => quiz.id !== action.payload);
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.list = state.list.map((quiz) =>
          quiz.id === action.payload.id ? action.payload : quiz
        );
      });
  },
});

export default quizSlice.reducer;
