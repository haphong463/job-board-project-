import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axiosRequest from "../../configs/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout, updateUserAndRoles } from "../../features/authSlice";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import registerImage from "../../";
import { FaUserCircle } from "react-icons/fa";
import "./global_navbar.css";
import { useTranslation } from "react-i18next";
export function GlobalNavbar() {
  const [categories, setCategories] = useState([]);
  const { t, i18n } = useTranslation(); // Initialize the useTranslation hook

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const roles = useSelector((state) => state.auth.roles);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!user) {
      dispatch(updateUserAndRoles());
    }
  }, [user, dispatch]);

  const fetchCategories = async () => {
    try {
      const response = await axiosRequest.get("/categories");
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    console.log("Selected category:", categoryName);
  };

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setDropdownOpen(false); // Close the dropdown after language change
  };
  return (
    <header className="site-navbar mt-3">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="site-logo col-6">
            <NavLink to="/">JobBoard</NavLink>
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
                <NavLink to="/blogs">Pages</NavLink>
                <ul className="dropdown">
                  <li>
                    <NavLink to="/services">Services</NavLink>
                  </li>
                  <li>
                    <NavLink to="/service-single">Service Single</NavLink>
                  </li>
                  <li>
                    <NavLink to="/blog-single">Blog Single</NavLink>
                  </li>
                  <li>
                    <NavLink to="/portfolio">Portfolio</NavLink>
                  </li>
                  <li>
                    <NavLink to="/portfolio-single">Portfolio Single</NavLink>
                  </li>
                  <li>
                    <NavLink to="/testimonials">Testimonials</NavLink>
                  </li>
                  <li>
                    <NavLink to="/faq">Frequently Ask Questions</NavLink>
                  </li>
                  <li>
                    <NavLink to="/gallery" className="active">
                      Gallery
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <NavLink to="/blogs">Blog</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
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
              <div className="ml-auto d-flex align-items-center">
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle nav caret>
                    {t("Language")}{" "}
                    {/* Display "Language" based on current language */}
                  </DropdownToggle>
                  <DropdownMenu className="custom-dropdown-menu">
                    <DropdownItem onClick={() => changeLanguage("vi")}>
                      Tiếng Việt
                    </DropdownItem>
                    <DropdownItem onClick={() => changeLanguage("en")}>
                      English
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
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
