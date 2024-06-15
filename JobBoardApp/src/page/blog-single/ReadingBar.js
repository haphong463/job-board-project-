import React, { useEffect, useState } from "react";
import styled from "styled-components";
const Bar = styled.div`
  position: fixed;
  height: 6px;
  border-radius: 0px 2px 0px 0px;
  background: linear-gradient(
    90deg,
    rgba(109, 227, 219, 1) 0%,
    rgba(132, 115, 177, 1) 100%,
    rgba(3, 9, 112, 1) 100%
  );
  z-index: 9999;
`;

const ReadingBar = () => {
  const [width, setWidth] = useState(0);
  const scrollHeight = () => {
    var el = document.documentElement,
      ScrollTop = el.scrollTop || document.body.scrollTop,
      ScrollHeight = el.scrollHeight || document.body.scrollHeight;
    var percent = (ScrollTop / (ScrollHeight - el.clientHeight)) * 100;
    setWidth(percent);
  };
  useEffect(() => {
    window.addEventListener("scroll", scrollHeight);
    return () => window.removeEventListener("scroll", scrollHeight);
  }, []);
  return (
    <Bar
      style={{
        width: width + "%",
      }}
    ></Bar>
  );
};

export default ReadingBar;
