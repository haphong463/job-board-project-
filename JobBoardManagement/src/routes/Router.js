import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Login from "../views/Login.js";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Blog = lazy(() => import("../views/ui/blog/Blog"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));

/*****Routes******/
const isLogin = false;
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/jobportal", element: <Navigate to="/jobportal/starter" /> },
      { path: "/", element: <Navigate to="/jobportal/starter" /> },
      { path: "/jobportal/starter", exact: true, element: <Starter /> },
      { path: "/jobportal/about", exact: true, element: <About /> },
      { path: "/jobportal/alerts", exact: true, element: <Alerts /> },
      { path: "/jobportal/badges", exact: true, element: <Badges /> },
      { path: "/jobportal/buttons", exact: true, element: <Buttons /> },
      { path: "/jobportal/cards", exact: true, element: <Cards /> },
      { path: "/jobportal/grid", exact: true, element: <Grid /> },
      { path: "/jobportal/table", exact: true, element: <Blog /> },
      { path: "/jobportal/forms", exact: true, element: <Forms /> },
      { path: "/jobportal/breadcrumbs", exact: true, element: <Breadcrumbs /> },
    ],
  },
  {
    path: "/jobportal/login",
    element: <Login />,
  },
];

export default ThemeRoutes;
