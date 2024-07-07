import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { signInAsync } from "../services/auth_service";
import {
  getUserByIDAsync,
  signOutAsync,
  updateUserAsync,
} from "../services/user_service";
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
export const updateUserThunk = createAsyncThunk(
  "user/update",
  async ({ formData, userId }, { rejectWithValue }) => {
    try {
      const res = await updateUserAsync(formData, userId);
      return res;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(error.message);
    }
  }
);


export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const res = await signOutAsync(refreshToken);
      return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const getUserByIDThunk = createAsyncThunk(
  "user/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getUserByIDAsync(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const name = "auth";
const token = localStorage.getItem("accessToken");

const initialState = {
  error: null,
  status: "idle",
  signInSuccess: false,
  isVerified: true,
  verificationEmail: null,
  verificationMessage: null,
  user: token ? jwtDecode(token) : null,
  location: "",
  userEdit: null,
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },

    setLocationState: (state, action) => {
      state.location = action.payload;
    },
    updateToken(state, action) {
      console.log(action.payload);
      state.user = jwtDecode(action.payload);
      localStorage.setItem("accessToken", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.signInSuccess = true;
        state.isVerified = true;
        state.user = jwtDecode(action.payload.accessToken);
        state.verificationMessage = null;

        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        if (action.payload && typeof action.payload === "object") {
          state.isVerified = false;
          state.verificationEmail = action.payload.email;
          state.verificationMessage = action.payload.message;
        }
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        console.log(">>> fulfilled: ", action.payload);
        state.userEdit = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        console.log(">>> rejected: ", action.payload);
        state.error = action.payload;
      })
      .addCase(getUserByIDThunk.fulfilled, (state, action) => {
        state.userEdit = action.payload;
      })
      .addCase(getUserByIDThunk.rejected, (state, action) => {
        console.log(">>> rejected: ", action.payload);
        state.error = action.payload;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      });
  },
});

export const { resetSignInSuccess, logout, setLocationState, updateToken } =
  authSlice.actions;

export default authSlice.reducer;
