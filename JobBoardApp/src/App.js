import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { routes } from "./utils/variables/routes";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  return (
    <>
      {/* <div className="App">
        <main>
          <BlogList />
        </main>
      </div> */}
      <Routes>
        {routes.map((item, index) => (
          <Route key={item.path} path={item.path} element={item.component} />
        ))}
      </Routes>
    </>
  );
}

export default App;
