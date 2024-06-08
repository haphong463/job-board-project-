import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

// import "./assets/js/jquery.min.js";
// import "./assets/js/bootstrap.bundle.min.js";
// import "./assets/js/isotope.pkgd.min.js";
// import "./assets/js/stickyfill.min.js";
// import "./assets/js/jquery.fancybox.min.js";
// import "./assets/js/jquery.easing.1.3.js";
// import "./assets/js/jquery.waypoints.min.js";
// import "./assets/js/jquery.animateNumber.min.js";
// import "./assets/js/owl.carousel.min.js";
// import "./assets/js/quill.min.js";
// import "./assets/js/bootstrap-select.min.js";
// import "./assets/js/custom.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
