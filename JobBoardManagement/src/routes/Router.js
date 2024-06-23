import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Login from "../views/Login.js";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const BlogCategory = lazy(() => import("../views/ui/blog-category/index"));
const JobCategory = lazy(() => import("../views/ui/job-category/index"));
const Blog = lazy(() => import("../views/ui/blog/index"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));
const User = lazy(() => import("../views/ui/user/index"));
const Quiz = lazy(() => import("../views/ui/quiz/index.js"));
/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/jobportal", element: <Navigate to="/jobportal/starter" /> },
      { path: "/", element: <Navigate to="/jobportal/starter" /> },
      { path: "/jobportal/starter", exact: true, element: <Starter /> },
      { path: "/jobportal/alerts", exact: true, element: <BlogCategory /> },
      { path: "/jobportal/settings", exact: true, element: <User /> },
      { path: "/jobportal/table", exact: true, element: <Blog /> },
      { path: "/jobportal/forms", exact: true, element: <Forms /> },
      { path: "/jobportal/quiz", exact: true, element: <Quiz /> },
      {
        path: "/jobportal/job-category",
        exact: true,
        element: <JobCategory />,
      },
      {
        path: "/jobportal/blog-category",
        exact: true,
        element: <BlogCategory />,
      },
     
    ],
  },
  {
    path: "/jobportal/login",
    element: <Login />,
  },
];

export default ThemeRoutes;
