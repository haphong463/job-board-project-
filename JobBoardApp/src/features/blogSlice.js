import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { findBlogById, getAllBlog } from "../services/blogService";

export const fetchBlogById = createAsyncThunk(
  "blogs/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await findBlogById(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllBlog = createAsyncThunk(
  "blogs/getALL",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllBlog();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: {
      title: "",
      content: "",
      imageUrl: "",
    },
    blogs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllBlog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBlog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default blogSlice.reducer;
