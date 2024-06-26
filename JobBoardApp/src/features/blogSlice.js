import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  findBlogById,
  getAllBlog,
  getAllBlogFilter,
} from "../services/BlogService";
import { getAllBlogCategories } from "../services/BlogCategoryService";

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

export const fetchAllCategories = createAsyncThunk(
  "blog-category",
  async () => {
    try {
      const res = await getAllBlogCategories();
      return res;
    } catch (error) {
      return error;
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
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async ({ query, type }, { rejectWithValue }) => {
    try {
      const response = await getAllBlogFilter({ query, type });
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: null,
    blogs: [],
    blogsFilter: [],
    status: "idle",
    error: null,
    categories: [],
    author: null,
    lastUpdated: null, // Thêm trường lastUpdated vào initialState
  },
  reducers: {
    addBlogBySocket: (state, action) => {
      state.blogs.push(action.payload);
    },
    updateBlogBySocket: (state, action) => {
      state.blogs = state.blogs.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      );
    },
    deleteBlogBySocket: (state, action) => {
      state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
    },
    updateLastUpdated: (state, action) => {
      state.lastUpdated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blog = action.payload;
        state.author = action.payload.user;
        state.lastUpdated = Date.now(); // Cập nhật lastUpdated khi fetch thành công
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllBlog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBlog.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.status = "succeeded";

        state.lastUpdated = Date.now(); // Cập nhật lastUpdated khi fetch thành công
      })
      .addCase(fetchAllBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload.slice(0, 3);
        state.lastUpdated = Date.now(); // Cập nhật lastUpdated khi fetch thành công
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogsFilter = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addBlogBySocket,
  updateBlogBySocket,
  deleteBlogBySocket,
  updateLastUpdated,
} = blogSlice.actions;

export default blogSlice.reducer;
