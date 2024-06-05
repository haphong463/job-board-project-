import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBlogCategory,
  getAllBlogCategories,
} from "../../services/Blog_CategoryService";

export const fetchBlogCategory = createAsyncThunk(
  "blog-category/fetch",
  async () => {
    const response = await getAllBlogCategories();
    return response;
  }
);

export const addBlogCategory = createAsyncThunk(
  "blog-category/add",
  async () => {
    const response = await createBlogCategory();
    return response;
  }
);

const blogCategorySlice = createSlice({
  name: "blogCategory",
  initialState: {
    blogCategory: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogCategory = action.payload;
      })
      .addCase(fetchBlogCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default blogCategorySlice.reducer;
