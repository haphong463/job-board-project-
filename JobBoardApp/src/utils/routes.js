import { AboutUs } from "../routes/client/about-us/AboutUs";
import { Home } from "../routes/client/home/Home";

export const routes = [
  { path: "/", component: <Home /> },
  { path: "/about", component: <AboutUs /> },
];
