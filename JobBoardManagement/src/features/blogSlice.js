// src/features/blogs/blogsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBlogs,
  createBlog,
  deleteBlog as deleteBlogApi,
  updateBlog,
} from "../services/BlogService";

// Thunk để fetch blogs
export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const response = await getAllBlogs();
  return response;
});

// Thunk để thêm blog
export const addBlog = createAsyncThunk("blogs/addBlog", async (newBlog) => {
  const response = await createBlog(newBlog);
  return response;
});

// Thunk để xóa blog
export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  await deleteBlogApi(id);
  return id;
});

export const editBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ newBlog, id }) => {
    const res = await updateBlog(newBlog, id);
    return res;
  }
);

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(editBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
  },
});

export default blogsSlice.reducer;
