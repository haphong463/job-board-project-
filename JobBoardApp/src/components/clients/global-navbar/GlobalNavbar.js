import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axiosRequest from "../../../configs/axiosConfig";

export function GlobalNavbar() {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  return (
    <header className="site-navbar mt-3">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="site-logo col-6">
            <NavLink to="/">JobBoard</NavLink>
          </div>

          <nav className="mx-auto site-navigation">
            <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
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
                <NavLink to="/services">Pages</NavLink>
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
                <NavLink to="/blog">Blog</NavLink>
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
            </ul>
          </nav>

          <div className="right-cta-menu text-right d-flex aligin-items-center col-6">
            <div className="ml-auto">
              <NavLink
                to="/post-job"
                className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"
              >
                <span className="mr-2 icon-add"></span>Post a Job
              </NavLink>
              <NavLink
                to="/login"
                className="btn btn-primary border-width-2 d-none d-lg-inline-block"
              >
                <span className="mr-2 icon-lock_outline"></span>Log In
              </NavLink>
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
    </header>
  );
}
