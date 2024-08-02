import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserByIDAsync, updateUserAsync, getEducationByUserIdAsync } from "../services/UserService";
import { jwtDecode } from "jwt-decode";

// Thunks for user operations
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

// Thunks for education operations
export const fetchEducationThunk = createAsyncThunk(
  "education/fetchEducation",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getEducationByUserIdAsync(userId);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const token = localStorage.getItem("accessToken");
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: token ? jwtDecode(token) : null,
    status: "idle",
    error: null,
    education: [],
    educationStatus: "idle",
    educationError: null,
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
      })
      .addCase(fetchEducationThunk.pending, (state) => {
        state.educationStatus = "loading";
      })
      .addCase(fetchEducationThunk.fulfilled, (state, action) => {
        state.educationStatus = "succeeded";
        state.education = action.payload;
      })
      .addCase(fetchEducationThunk.rejected, (state, action) => {
        state.educationStatus = "failed";
        state.educationError = action.payload;
      });
  },
});

export const { updateToken } = userSlice.actions;

export default userSlice.reducer;
