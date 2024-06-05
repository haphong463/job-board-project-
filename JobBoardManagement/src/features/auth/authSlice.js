import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signIn } from "../../services/AuthService";

// Thunk để login và lấy token
export const login = createAsyncThunk("auth/login", async (credentials) => {
  const response = await signIn(credentials);
  if (response) {
    return response.accessToken;
  }
  throw new Error("Login failed");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: localStorage.getItem("accessToken") || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload;
        localStorage.setItem("accessToken", action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
