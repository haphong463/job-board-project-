// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./features/blogSlice";
import blogCategoryReducer from "./features/blogCategorySlice";
import authReducer from "./features/authSlice";
export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    blogCategory: blogCategoryReducer,
    auth: authReducer,
  },
});
