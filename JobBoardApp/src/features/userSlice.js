import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserByIDAsync, updateUserAsync } from "../services/UserService";
import {jwtDecode} from "jwt-decode";

export const fetchUserThunk = createAsyncThunk(
  "user/fetchUser",
  async ({ username, token }, { rejectWithValue }) => {
    try {
      const res = await getUserByIDAsync(username);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async ({ formData, userId }, { rejectWithValue }) => {
    try {
      const res = await updateUserAsync(formData, userId);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const name = "auth";
const token = localStorage.getItem("accessToken");
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: token ? jwtDecode(token) : null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateToken(state, action) {
      state.user = jwtDecode(action.payload);
      localStorage.setItem("accessToken", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.userEdit = action.payload;
        state.user = { ...state.user, imageUrl: action.payload.imageUrl };
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { updateToken } = userSlice.actions;

export default userSlice.reducer;
