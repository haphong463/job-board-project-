// src/app/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./features/blogSlice";
import blogCategoryReducer from "./features/blogCategorySlice";
import authReducer from "./features/authSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const reducer = combineReducers({
  blogs: blogsReducer,
  blogCategory: blogCategoryReducer,
  auth: authReducer,
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
