// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./features/blogs/blogSlice";
import blogCategoryReducer from "./features/blog-category/blogCategorySlice";
import authReducer from "./features/auth/authSlice";
export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    blogCategory: blogCategoryReducer,
    auth: authReducer,
  },
});
