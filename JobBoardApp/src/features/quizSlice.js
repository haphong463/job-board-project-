// src/features/quizSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getQuizzes } from '../services/QuizService';

export const fetchQuizzesThunk = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (_, thunkAPI) => {
    try {
      const response = await getQuizzes();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default quizSlice.reducer;
