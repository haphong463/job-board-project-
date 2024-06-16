import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./features/blogSlice";
import commentReducer from "./features/commentSlice";
import authReducer from "./features/authSlice";
import categoryReducer from "./features/categorySlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  blogs: blogsReducer,
  comments: commentReducer,
  auth: authReducer,
  category: categoryReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
      serializableCheck: false,
    }),
});
