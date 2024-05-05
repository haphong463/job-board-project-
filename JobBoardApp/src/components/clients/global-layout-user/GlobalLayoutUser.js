import React from "react";
import { GlobalNavbar } from "../global-navbar/GlobalNavbar";
import { GlobalFooter } from "../global-footer/GlobalFooter";
import { GlobalSiteMobileMenu } from "../global-site-mobile/GlobalSiteMobile";

export const GlobalLayoutUser = ({ children }) => {
  return (
    <div id="top">
      <div id="overlayer"></div>
      <div className="loader">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      <div className="site-wrap">
        <GlobalSiteMobileMenu />
        <GlobalNavbar />
        {children}
        <GlobalFooter />
      </div>
    </div>
  );
};
