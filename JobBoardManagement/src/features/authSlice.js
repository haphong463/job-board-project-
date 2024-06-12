import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { signInAsync } from "../services/AuthService";
const userNotFound = "User not found";
const badCredentials = "Bad credentials";

export const login = createAsyncThunk(
  "auth/signin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signInAsync(data);
      if (typeof res === "string") {
        switch (res) {
          case badCredentials:
            return rejectWithValue({
              message: "Your username or password is incorrect.",
            });
          case userNotFound:
            return rejectWithValue({
              message: "User not found",
            });
          default:
            return rejectWithValue({
              message: "Oops! Something went wrong",
            });
        }
      }
      if (typeof res === "object" && res.verified === false) {
        return rejectWithValue({
          email: res.email,
          message: "Please check your email to verify your account.",
        });
      }
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const name = "auth";
const initialState = {
  error: null,
  state: "idle",
  signInSuccess: false,
  isVerified: true,
  verificationEmail: null,
  verificationMessage: null,
  roles: [],
  user: null,
  location: "",
};

const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    resetSignInSuccess(state) {
      state.signInSuccess = false;
    },
    logout(state) {
      state.user = null;
      state.roles = [];
      localStorage.removeItem("accessToken");
    },
    updateUserAndRoles(state) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        state.user = jwtDecode(token);
        state.roles = state.user.role.map((r) => r.authority);
      } else {
        state.user = null;
        state.roles = [];
      }
    },
    setLocationState: (state, action) => {
      state.location = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.state = "succeeded";
        state.signInSuccess = true;
        state.isVerified = true;
        state.user = jwtDecode(action.payload.accessToken);
        console.log(">>>state user: ", state.user);
        state.roles = state.user.role.map((r) => r.authority);
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload;
        if (action.payload && typeof action.payload === "object") {
          state.isVerified = false;
          state.verificationEmail = action.payload.email;
          state.verificationMessage = action.payload.message;
        }
      });
  },
});

export const {
  resetSignInSuccess,
  logout,
  updateUserAndRoles,
  setLocationState,
} = authSlice.actions;

export default authSlice.reducer;
