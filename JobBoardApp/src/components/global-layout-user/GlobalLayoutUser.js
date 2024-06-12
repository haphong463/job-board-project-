import React, { useEffect } from "react";
import { GlobalNavbar } from "../global-navbar/GlobalNavbar";
import { GlobalFooter } from "../global-footer/GlobalFooter";
import { GlobalSiteMobileMenu } from "../global-site-mobile/GlobalSiteMobile";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5 },
};

export const GlobalLayoutUser = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    scroll.scrollToTop({
      duration: 500,
      smooth: "easeInOutQuart",
    });
  }, [location]);
  return (
    <div id="top">
      {/* <div id="overlayer"></div>
      <div className="loader">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> */}
      <div className="site-wrap">
        <GlobalSiteMobileMenu />
        <GlobalNavbar />
        <AnimatePresence>
          <motion.div
            key={location.pathname} // Ensure unique key for each route
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <GlobalFooter />
      </div>
    </div>
  );
};
