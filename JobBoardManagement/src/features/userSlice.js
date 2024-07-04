import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllUserAsync } from "../services/user_service";
export const getUserThunk = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllUserAsync();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  initialState: {
    list: [],
  },
  name: "user",
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.list = action.payload;
    }),
});

export default userSlice.reducer;
