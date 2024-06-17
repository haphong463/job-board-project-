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
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5 },
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
  useEffect(() => {
    (function (d, m) {
      var kommunicateSettings = {
        appId: "4ad31fa80e50f3c68e389cbfeffad7ac",
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
      };
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
  }, []);
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
