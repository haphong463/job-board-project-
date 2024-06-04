import React, { useState } from "react";
import { Button, Nav, NavItem, Collapse } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  {
    title: "Dashboard",
    href: "/jobportal/starter",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Components",
    icon: "bi bi-collection",
    children: [
      {
        title: "Alert",
        href: "/jobportal/alerts",
        icon: "bi bi-bell",
      },
      {
        title: "Badges",
        href: "/jobportal/badges",
        icon: "bi bi-patch-check",
      },
      {
        title: "Buttons",
        href: "/jobportal/buttons",
        icon: "bi bi-hdd-stack",
      },
      {
        title: "Cards",
        href: "/jobportal/cards",
        icon: "bi bi-card-text",
      },
      {
        title: "Grid",
        href: "/jobportal/grid",
        icon: "bi bi-columns",
      },
    ],
  },
  {
    title: "Table",
    href: "/jobportal/table",
    icon: "bi bi-layout-split",
  },
  {
    title: "Forms",
    href: "/jobportal/forms",
    icon: "bi bi-textarea-resize",
  },
  {
    title: "Breadcrumbs",
    href: "/jobportal/breadcrumbs",
    icon: "bi bi-link",
  },
  {
    title: "About",
    href: "/jobportal/about",
    icon: "bi bi-people",
  },
];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  const location = useLocation();
  const [collapseStates, setCollapseStates] = useState({});

  const toggleCollapse = (index) => {
    setCollapseStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const renderNavItems = (items) => {
    return items.map((item, index) => {
      if (item.children) {
        return (
          <NavItem key={index} className="sidenav-bg">
            <div
              className="nav-link text-secondary py-3 d-flex align-items-center"
              onClick={() => toggleCollapse(index)}
            >
              <i className={item.icon}></i>
              <span className="ms-3 d-inline-block">{item.title}</span>
            </div>
            <Collapse isOpen={collapseStates[index]}>
              <Nav
                className="nested-sidebarNav"
                style={{ marginLeft: "10px" }}
                vertical
              >
                {item.children.map((child, idx) => (
                  <NavItem key={idx} className="sidenav-bg">
                    <Link
                      to={child.href}
                      className={
                        location.pathname === child.href
                          ? "text-primary nav-link py-3 d-flex align-items-center"
                          : "nav-link text-secondary py-3 d-flex align-items-center"
                      }
                    >
                      <i className={child.icon}></i>
                      <span className="ms-3 d-inline-block">{child.title}</span>
                    </Link>
                  </NavItem>
                ))}
              </Nav>
            </Collapse>
          </NavItem>
        );
      } else {
        return (
          <NavItem key={index} className="sidenav-bg">
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
          <Button
            color="danger"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://www.wrappixel.com/templates/xtreme-react-redux-admin/?ref=33"
          >
            Upgrade To Pro
          </Button>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
