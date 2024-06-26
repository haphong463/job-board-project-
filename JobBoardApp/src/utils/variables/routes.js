import { AboutUs } from "../../page/about-us/AboutUs";
import { BlogSingle } from "../../page/blog-single/BlogSingle";
import  Blog  from "../../page/blog/Blog";
import { Contact } from "../../page/contact/Contact";
import { Faq } from "../../page/faq/Faq";
import { Home } from "../../page/home/Home";
import { Portfolio } from "../../page/portfolio/Portfolio";
import { PortfolioSingle } from "../../page/portfolio-single/PortfolioSingle";
import { JobListing } from "../../page/job-listing/JobListing";
import { PostJob } from "../../page/post-job/PostJob";
import { Login } from "../../page/login/Login";
import SignUp from "../../page/signup/SignUp";
import ForgotPassword from "../../page/login/ForgotPassword";
import { Gallery } from "../../page/gallery/Gallery";
import { ResetPassword } from "../../page/login/ResetPassword";
import { JobSingle } from "../../page/job-single/JobSingle";
import EmployerSignUp from "../../page/signup/EmployerSignUp";
import { PostCompany } from "../../page/post-company/PostCompany";
import CreateCV from "../../page/user-cv/CreateCv";
import CreateTemplate from "../../page/user-cv/CreateTemplate";
import ListTemplate from "../../page/list-template/ListTemplate";

import SetupCredentials from "../../page/signup/SetupCredentials";
import { Quiz } from "../../page/quiz/quiz";
import QuizResult from "../../page/quiz/QuizResult";
import QuizQuestions from "../../page/quiz/QuizQuestions";
export const routes = [
  { path: "/", component: <Home /> },
  { path: "/about", component: <AboutUs /> },
  { path: "/blogs", component: <Blog /> },
  { path: "/blog/:id", component: <BlogSingle /> },
  { path: "/contact", component: <Contact /> },
  { path: "/post-job", component: <PostJob /> },
  { path: "/portfolio", component: <Portfolio /> },
  { path: "/portfolio/:id", component: <PortfolioSingle /> },
  { path: "/job-listing", component: <JobListing /> },
  { path: "/login", component: <Login /> },
  { path: "/signup", component: <SignUp /> },
  { path: "/create-cv", component: <CreateCV /> },
  { path: "/create-template", component: <CreateTemplate /> },

  { path: "/list-template", component: <ListTemplate /> },
  { path: "/ResetPassword", component: <ResetPassword /> },
  { path: "/ForgotPassword", component: <ForgotPassword /> },
  { path: "/job-listings", component: <JobListing /> },
  { path: "/job/:id", component: <JobSingle /> },
  { path: "/gallery", component: <Gallery /> },
  { path: "/EmployerSignUp", component: <EmployerSignUp /> },
  { path: "/SetupCredentials", component: <SetupCredentials /> },
  { path: "/quiz", component: <Quiz /> },
  { path: "/quiz/:quizId", component: <QuizQuestions /> },
  { path: "/quiz/:quizId/result", component: <QuizResult /> },
];
