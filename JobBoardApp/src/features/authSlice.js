import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInAysnc, signUpAsync } from "../services/authService";
import { jwtDecode } from "jwt-decode";
const userNotFound = "User not found";
const badCredentials = "Bad credentials";

export const signIn = createAsyncThunk(
  "auth/signin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signInAysnc(data);
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

export const signUp = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signUpAsync(data);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.post("/forgot-password", { email });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const name = "auth";
const initialState = {
  error: null,
  state: "idle",
  signUpSuccess: false,
  signInSuccess: false,
  isVerified: true,
  verificationEmail: null,
  verificationMessage: null,
  roles: [],
  user:
    localStorage.getItem("accessToken") &&
    jwtDecode(localStorage.getItem("accessToken")),
};

const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    resetSignUpSuccess(state) {
      state.signUpSuccess = false;
    },
    resetSignInSuccess(state) {
      state.signInSuccess = false;
    },
    logout(state) {
      state.user = null;
      state.roles = [];
      localStorage.removeItem("accessToken");
    },

    resetVerificationMessage(state) {
      state.verificationMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.state = "succeeded";
        state.signUpSuccess = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload;
      })
      .addCase(signIn.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.state = "succeeded";
        state.signInSuccess = true;
        state.isVerified = true;
        state.user = jwtDecode(action.payload.accessToken);
        console.log(">>>state user: ", state.user);
        state.roles = state.user.role.map((r) => r.authority);
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(signIn.rejected, (state, action) => {
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
  resetSignUpSuccess,
  resetSignInSuccess,
  logout,
  resetVerificationMessage,
} = authSlice.actions;

export default authSlice.reducer;
