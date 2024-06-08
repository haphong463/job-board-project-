import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./features/blogSlice";
import commentReducer from "./features/commentSlice";
import authReducer from "./features/authSlice";
export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    comments: commentReducer,
    auth: authReducer,
  },
});
