import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./utils/variables/routes";
import "./index.css";
import { FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { connectWebSocket } from "./services/WebSocketService";
import { getNotificationThunk } from "./features/notificationSlice";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!document.getElementById("kommunicate-script")) {
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
        s.id = "kommunicate-script"; // Add an id to the script
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
        window.kommunicate = m;
        m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
    }
  }, []);
  useEffect(() => {
    if (user) {
      connectWebSocket(user);
      dispatch(getNotificationThunk(user.id));
    }
    localStorage.removeItem("persist:root");
  }, [dispatch, user]);
  return (
    <>
      <Routes>
        {routes.map((item) => (
          <Route key={item.path} path={item.path} element={item.component} />
        ))}
      </Routes>
    </>
  );
}

export default App;
