// src/app/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./features/blogSlice";
import blogCategoryReducer from "./features/blogCategorySlice";
import authReducer from "./features/authSlice";
import jobCategoryReducer from "./features/jobCategorySlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import quizReducer from "./features/quizSlice"; // Adjust the path as necessary
import questionReducer from "./features/questionSlice";
import userReducer from "./features/userSlice";
import cvReducer from "./features/cvSlice";



const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [""],
  blacklist: ["jobCategory", "auth"],
};
const reducer = combineReducers({
  blogs: blogsReducer,
  blogCategory: blogCategoryReducer,
  auth: authReducer,
  jobCategory: jobCategoryReducer,
  quizzes: quizReducer,
  questions: questionReducer,
  user: userReducer,
  templates: cvReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
export { store };
