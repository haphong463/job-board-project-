import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, signOut } from "../../features/authSlice";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "./global_navbar.css";
import { fetchCategoryThunk } from "../../features/categorySlice";
import {
  deleteNotificationThunk,
  markNotificationAsRead,
  readNotificationThunk,
} from "../../features/notificationSlice";
import { fetchAllCategories } from "../../features/blogSlice";
import { debounce } from "@mui/material";
import { MdDelete, MdMessage } from "react-icons/md";

import { Link } from "react-scroll";
import Swal from "sweetalert2";
export function GlobalNavbar() {
  const [searchParams] = useSearchParams();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false); // Thêm state để quản lý dropdown thông báo
  const navigate = useNavigate();

  const notifications = useSelector((state) => state.notification.list);
  const user = useSelector((state) => state.auth.user);
  const roles = useSelector((state) => state.auth.roles);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  const blogCategory = useSelector((state) => state.blogs.categories);
  const unreadCount = useSelector((state) => state.notification.unreadCount);

  const handleLogout = () => {
    dispatch(signOut()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/login");
      }
    });
  };

  const handleCvManagementClick = () => {
    navigate("/cv-management");
  };

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoryThunk());
      dispatch(fetchAllCategories());
    }
  }, [dispatch]);

  const handleCategoryClick = (categoryName) => {
    // setSelectedCategory(categoryName);
    console.log("Selected category:", categoryName);
  };

  const handleMarkNotification = useCallback(
    debounce((id) => {
      dispatch(readNotificationThunk(id));
    }, 500),
    [dispatch]
  );

  const handleDeleteNotification = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteNotificationThunk(id));
        Swal.fire("Deleted!", "Your notification has been deleted.", "success");
      }
    });
  };

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleNotification = () =>
    setNotificationOpen((prevState) => !prevState); // Toggle dropdown thông báo

  return (
    <header className="site-navbar mt-3">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="site-logo col-6">
            <NavLink to="/">JobGrove </NavLink>
          </div>

          <nav className="mx-auto site-navigation">
            <ul className="site-menu  d-none d-xl-block ml-0 pl-0">
              <li>
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li
                className="has-children"
                onMouseEnter={() => setHoveredCategory("Job By Skills")}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <NavLink to="/job-listings">Job Listings</NavLink>
                <ul className="dropdown">
                  <li>
                    <NavLink to="/job-single">Job By Skills</NavLink>
                    <div>
                      {hoveredCategory === "Job By Skills" && (
                        <ul>
                          {categories.map((category) => (
                            <li
                              key={category.categoryId}
                              onClick={() =>
                                handleCategoryClick(category.categoryName)
                              }
                            >
                              <a
                                href={`/search?category=${category.categoryName}`}
                              >
                                {category.categoryName}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                </ul>
              </li>

              <li className="has-children">
                <NavLink to="/blogs">Blog</NavLink>
                <ul className="dropdown">
                  {blogCategory.map((item) => (
                    <li key={item.id}>
                      <NavLink
                        to={`/blogs?type=${encodeURIComponent(item.name)}`}
                        className={({ isActive }) =>
                          isActive && searchParams.get("type") === item.name
                            ? "active"
                            : ""
                        }
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
              <li>
                    <NavLink to="/create-cv">Create CV</NavLink>
                  </li>
              <li>
                <NavLink to="/quiz">Quiz</NavLink>
              </li>
              {!roles.includes("ROLE_EMPLOYER") && (
                <li>
                  <NavLink to="/EmployerSignUp">For Employer</NavLink>
                </li>
              )}

              <li className="d-lg-none">
                <NavLink to="/post-job">
                  <span className="mr-2">+</span> Post a Job
                </NavLink>
              </li>

              <li className="d-lg-none">
                <NavLink to="/login">Log In</NavLink>
              </li>
              <li className="d-lg-none">
                <NavLink to="/signup">Sign Up</NavLink>
              </li>
            </ul>
          </nav>

          <div className="right-cta-menu text-right d-flex align-items-center col-6">
            <div className="ml-auto d-flex align-items-center">
              {user && roles.includes("ROLE_EMPLOYER") && (
                <NavLink
                  to="/post-job"
                  className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"
                >
                  <span className="mr-2 icon-add"></span>Post a Job
                </NavLink>
              )}
              {user && (
                <div className="icon-notification" onClick={toggleNotification}>
                  <FaBell
                    size={30}
                    color="white"
                    className={unreadCount > 0 ? "shake" : ""}
                  />
                  {unreadCount > 0 && (
                    <span
                      className="badge"
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "-10px",
                        backgroundColor: "#ff0000",
                        color: "#fff",
                        padding: "5px 7px",
                        borderRadius: "50%",
                        fontSize: "12px",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
              {notificationOpen && (
                <div className="notifications text-left" id="box">
                  <h2>Notifications</h2>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="notification-container"
                      >
                        <div
                          className="notifications-item"
                          onClick={
                            !notification.read
                              ? () => {
                                  handleMarkNotification(notification.id);
                                  navigate(notification.url);
                                }
                              : () => {
                                  navigate(notification.url);
                                }
                          }
                        >
                          <div className="avatar-container">
                            <img src={notification.sender.imageUrl} alt="img" />
                            {notification.type === "COMMENT" && (
                              <div className="icon-container">
                                <MdMessage className="message-icon" />
                              </div>
                            )}
                          </div>
                          <div className="text">
                            <h4
                              className={`${
                                notification.read ? "" : "font-weight-bold"
                              }`}
                            >
                              {notification.sender.firstName}{" "}
                              {notification.sender.lastName}
                            </h4>
                            <p
                              className={`${
                                notification.read ? "" : "font-weight-bold"
                              }`}
                            >
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <button
                          className="delete-button"
                          onClick={(e) => {
                            handleDeleteNotification(notification.id);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center">
                      <img
                        src="https://static.topcv.vn/v4/image/toppy-notification-empty.png"
                        alt="No notifications"
                      />
                      <p>You don't have any notifications yet.</p>
                    </div>
                  )}
                </div>
              )}

              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggleDropdown}
                direction="down"
              >
                <DropdownToggle nav caret>
                  <FaUserCircle size={30} color="white" />
                </DropdownToggle>
                <DropdownMenu className="custom-dropdown-menu">
                  {user ? (
                    <>
                      <DropdownItem
                        header
                        className="text-uppercase font-weight-bold"
                      >
                        {user.sub}
                      </DropdownItem>
                      <DropdownItem onClick={handleCvManagementClick}>
                        CV Management
                      </DropdownItem>
                      <DropdownItem onClick={handleLogout}>
                        Log out
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <NavLink to="/login" className="dropdown-item">
                        <span className="mr-2 icon-lock_outline"></span>Log In
                      </NavLink>
                      <NavLink to="/signup" className="dropdown-item">
                        <span className="mr-2 icon-lock_outline"></span>Sign Up
                      </NavLink>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>

              <NavLink
                to="#"
                className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3"
              >
                <span className="icon-menu h3 m-0 p-0 mt-2"></span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
