import React, { useEffect } from "react";
import { GlobalNavbar } from "../global-navbar/GlobalNavbar";
import { GlobalFooter } from "../global-footer/GlobalFooter";
import { GlobalSiteMobileMenu } from "../global-site-mobile/GlobalSiteMobile";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { refreshAuthToken } from "../../utils/authUtils";

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: {
    duration: 0.4,
    ease: "easeInOut",
  },
};

export const GlobalLayoutUser = ({ children }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    scroll.scrollToTop({
      duration: 500,
      smooth: "easeInOutQuart",
    });
  }, [location]);

  useEffect(() => {
    if (user) {
      const refreshTokenTimeout = refreshAuthToken(user, dispatch, navigate);
      return () => clearTimeout(refreshTokenTimeout);
    }
  }, []);

  return (
    <div id="top">
      <div className="site-wrap">
        <GlobalSiteMobileMenu />
        <GlobalNavbar />
        <AnimatePresence>
          <motion.div
            key={location.pathname}
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
