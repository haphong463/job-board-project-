import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllUserAsync,
  updateUserEnableStatusAsync,
} from "../services/user_service";
export const getUserThunk = createAsyncThunk(
  "user/getUser",
  async ({ query, page, size }, { rejectWithValue }) => {
    try {
      return await getAllUserAsync(query, page, size);
    } catch (error) {
      console.log("error: ", error.response.data);

      return rejectWithValue(error.message);
    }
  }
);

export const updateUserStatusThunk = createAsyncThunk(
  "user/update",
  async ({ userId, isEnabled }, { rejectWithValue }) => {
    try {
      console.log(">>> isEnabled: ", isEnabled);
      const res = await updateUserEnableStatusAsync(userId, isEnabled);
      return res;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(error.message);
    }
  }
);
const userSlice = createSlice({
  initialState: {
    list: [],
    totalPages: 0,
    status: "idle",
    error: null,
  },
  name: "user",
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(">>>list: ", action.payload);
        state.list = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(updateUserStatusThunk.fulfilled, (state, action) => {
        state.list = state.list.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      }),
});

export default userSlice.reducer;
