import React, { useEffect, useState } from "react";
import { Button, Nav, NavItem, Collapse, Spinner } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigation } from "../utils/variables/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAndUpdateAccessToken,
  logout,
  signOut,
} from "../features/authSlice";
import { IoLogOut } from "react-icons/io5";

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [countdown, setCountdown] = useState(1);

  const location = useLocation();
  const [collapseStates, setCollapseStates] = useState({});

  const toggleCollapse = (index) => {
    setCollapseStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const renderNavItems = (items, parentIndex = "") => {
    return items.map((item, index) => {
      const currentIndex = `${parentIndex}${index}`;
      if (item.children) {
        return (
          <NavItem key={currentIndex} className="sidenav-bg">
            <div
              className="nav-link text-secondary py-3 d-flex align-items-center justify-content-between"
              onClick={() => toggleCollapse(currentIndex)}
            >
              <div className="d-flex align-items-center">
                <i className={item.icon}></i>
                <span className="ms-3 d-inline-block">{item.title}</span>
              </div>
              {collapseStates[currentIndex] ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </div>
            <Collapse isOpen={collapseStates[currentIndex]}>
              <Nav
                className="nested-sidebarNav"
                style={{ marginLeft: "10px" }}
                vertical
              >
                {renderNavItems(item.children, `${currentIndex}-`)}
              </Nav>
            </Collapse>
          </NavItem>
        );
      } else {
        return (
          <NavItem key={currentIndex} className="sidenav-bg">
            <Link
              to={item.href}
              className={
                location.pathname === item.href
                  ? "text-primary nav-link py-3 d-flex align-items-center"
                  : "nav-link text-secondary py-3 d-flex align-items-center"
              }
            >
              <i className={item.icon}></i>
              <span className="ms-3 d-inline-block">{item.title}</span>
            </Link>
          </NavItem>
        );
      }
    });
  };

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <span className="ms-auto d-lg-none">
          <Button
            close
            size="sm"
            className="ms-auto d-lg-none"
            onClick={() => showMobilemenu()}
          ></Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {renderNavItems(navigation)}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
