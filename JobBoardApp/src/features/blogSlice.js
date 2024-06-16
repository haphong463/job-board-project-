import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { findBlogById, getAllBlog } from "../services/BlogService";
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
      return await getAllBlogCategories();
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

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: {
      title: "",
      content: "",
      imageUrl: "",
      user: {
        firstName: "",
        lastName: "",
      },
    },
    blogs: [],
    status: "idle",
    error: null,
    categories: [],
    author: null,
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

        console.log(state.author);
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
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload.slice(0, 3);
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addBlogBySocket, updateBlogBySocket, deleteBlogBySocket } =
  blogSlice.actions;

export default blogSlice.reducer;
