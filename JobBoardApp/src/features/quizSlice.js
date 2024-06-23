// src/features/quiz/quizSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllQuizzes } from "../services/QuizService";

export const fetchQuizzesThunk = createAsyncThunk(
  "quizzes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllQuizzes();
      return response.data;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  quizzes: [],
  status: "idle",
  error: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuizzesThunk.fulfilled, (state, action) => {
        state.quizzes = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchQuizzesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default quizSlice.reducer;
