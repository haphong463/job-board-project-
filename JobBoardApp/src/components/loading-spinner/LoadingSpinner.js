// components/LoadingSpinner.js
import React from "react";
import { Spinner } from "reactstrap";
import "./style.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <Spinner style={{ width: "3rem", height: "3rem" }} />
    </div>
  );
};

export default LoadingSpinner;
