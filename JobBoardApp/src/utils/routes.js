import { AboutUs } from "../routes/client/about-us/AboutUs";
import { BlogSingle } from "../routes/client/blog-single/BlogSingle";
import { Blog } from "../routes/client/blog/Blog";
import { Contact } from "../routes/client/contact/Contact";
import { Faq } from "../routes/client/faq/Faq";
import { Home } from "../routes/client/home/Home";
import { Portfolio } from "../routes/client/portfolio/Portfolio";
import { PortfolioSingle } from "../routes/client/portfolio-single/PortfolioSingle";
import { JobListing } from "../routes/client/job-listing/JobListing";
import { PostJob } from "../routes/client/post-job/PostJob";

export const routes = [
  { path: "/", component: <Home /> },
  { path: "/about", component: <AboutUs /> },
  { path: "/blogs", component: <Blog /> },
  { path: "/blog/:id", component: <BlogSingle /> },
  { path: "/contact", component: <Contact /> },
  { path: "/post-job", component: <PostJob /> },
  { path: "/portfolio", component: <Portfolio /> },
  { path: "/portfolio-single", component: <PortfolioSingle /> },
  { path: "/job-listing", component: <JobListing /> },
  { path: "/faq", component: <Faq /> },
  { path: "/faq", component: <Faq /> },
  { path: "/faq", component: <Faq /> },
];
