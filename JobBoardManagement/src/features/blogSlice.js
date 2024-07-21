import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBlogs,
  createBlog,
  deleteBlog as deleteBlogApi,
  updateBlog,
  getAllBlogsByQuery,
} from "../services/blog_service";

// Thunk để fetch blogs
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllBlogs();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchBlogs = createAsyncThunk(
  "blogs/searchBlogs",
  async ({ query, page, size, type, visibility }, { rejectWithValue }) => {
    try {
      const response = await getAllBlogsByQuery(
        query,
        type,
        visibility,
        page,
        size
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBlog = createAsyncThunk(
  "blogs/addBlog",
  async (newBlog, { rejectWithValue }) => {
    try {
      const response = await createBlog(newBlog);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBlogApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ newBlog, id }, { rejectWithValue }) => {
    try {
      const res = await updateBlog(newBlog, id);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    status: "idle",
    totalPages: 0,
    error: null,
    statusSubmit: "idle",
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
      .addCase(searchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(addBlog.pending, (state, action) => {
        state.statusSubmit = "loading";
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.statusSubmit = "rejected";
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(editBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        state.statusSubmit = "succeeded";
      })
      .addCase(editBlog.pending, (state, action) => {
        state.statusSubmit = "loading";
      });
  },
});

export default blogsSlice.reducer;
