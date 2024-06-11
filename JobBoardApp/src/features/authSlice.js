import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInAysnc, signUpAsync } from "../services/authService";

export const signIn = createAsyncThunk("auth/signin", async (data) => {
  try {
    const res = await signInAysnc(data);
    if (res.status === 400) {
      return null;
    }
    if (typeof res === "boolean" && !res) {
      console.log("Not verified!");
      throw new Error("Not verified");
    }
    console.log(">>> res from thunk: ", res);
    return res;
  } catch (error) {
    throw new Error(error.message); // Trả về lỗi để reject Promise
  }
});
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
  accessToken: localStorage.getItem("accessToken") || null,
  error: null,
  state: "idle",
  signUpSuccess: false, // Add this line
  signInSuccess: false,
  isVerified: true,
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
        console.log(action.payload);

        state.accessToken = action.payload.accessToken; // Assuming the response includes an access token
        localStorage.setItem("accessToken", action.payload.accessToken); // Save token to localStorage
      })
      .addCase(signIn.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload;
        console.log(action.error.message);
      });
  },
});

export const { resetSignUpSuccess, resetSignInSuccess } = authSlice.actions;

export default authSlice.reducer;
