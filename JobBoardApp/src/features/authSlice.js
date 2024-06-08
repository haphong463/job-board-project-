import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInAysnc, signUpAsync } from "../services/authService";

export const signIn = createAsyncThunk(
  "auth/signin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signInAysnc(data);
      console.log(">>> res from thunk: ", res);
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

const name = "auth";
const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  error: null,
  state: "idle",
  signUpSuccess: false, // Add this line
  signInSuccess: false,
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
        state.accessToken = action.payload.accessToken; // Assuming the response includes an access token
        localStorage.setItem("accessToken", action.payload.accessToken); // Save token to localStorage
      })
      .addCase(signIn.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetSignUpSuccess, resetSignInSuccess } = authSlice.actions;

export default authSlice.reducer;
