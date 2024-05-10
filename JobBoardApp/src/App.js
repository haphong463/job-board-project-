import logo from "./logo.svg";
import "./App.css";
import { Home } from "./routes/client/home/Home";
import { Route, Routes } from "react-router-dom";
import { routes } from "./utils/routes";
import { BlogSingle } from "./routes/client/blog-single/BlogSingle";

function App() {
  return (
    <>
      <Routes>
        {routes.map((item, index) => (
          <Route key={item.path} path={item.path} element={item.component} />
        ))}
      </Routes>
    </>
  );
}

export default App;
