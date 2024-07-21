import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./features/blogSlice";
import commentReducer from "./features/commentSlice";
import authReducer from "./features/authSlice";
import categoryReducer from "./features/categorySlice";
import notificationReducer from "./features/notificationSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import quizReducer from './features/quizSlice';
import quizQuestionsReducer from './features/quizQuestionsSlice';
import jobReducer from './features/jobSlice';
import companyReducer from './features/companySlice';

// Cấu hình persist với whitelist
// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

// const rootReducer = combineReducers({
//   blogs: blogsReducer,
//   comments: commentReducer,
//   auth: authReducer,
//   category: categoryReducer,
//   notification: notificationReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store với persistedReducer
export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    comments: commentReducer,
    auth: authReducer,
    category: categoryReducer,
    notification: notificationReducer,
    quiz: quizReducer,
    job: jobReducer,
    company: companyReducer
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
});
