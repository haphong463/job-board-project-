import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, signOut } from "../../features/authSlice";
import
{
   Dropdown,
   DropdownToggle,
   DropdownMenu,
   DropdownItem,
} from "reactstrap";
import { FaBell, FaChevronRight, FaUserCircle } from "react-icons/fa";
import "./global_navbar.css";
import { fetchCategoryThunk } from "../../features/categorySlice";
import
{
   markNotificationAsRead,
   readNotificationThunk,
} from "../../features/notificationSlice";
import { fetchAllCategories } from "../../features/blogSlice";
import { debounce } from "@mui/material";
import categoryData from './category.json';
import companyData from '../../page/job-listing/company_data.json';

export function GlobalNavbar ()
{
   const [searchParams] = useSearchParams();
   // const [categories, setCategories] = useState([]);
   const [companies, setCompanies] = useState([]);
   const [isSkillsDropdownVisible, setSkillsDropdownVisible] = useState(false);
   const [isCompanyDropdownVisible, setCompanyDropdownVisible] = useState(false);
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const [notificationOpen, setNotificationOpen] = useState(false);

   const categories = useSelector((state) => state.category.categories);
   const notifications = useSelector((state) => state.notification.list);
   const user = useSelector((state) => state.auth.user);
   const roles = useSelector((state) => state.auth.roles);
   const dispatch = useDispatch();
   const blogCategory = useSelector((state) => state.blogs.categories);
   const unreadCount = useSelector((state) => state.notification.unreadCount);
   const navigate = useNavigate();

   const handleLogout = () =>
   {
      dispatch(signOut());
   };

   useEffect(() =>
   {
      dispatch(fetchCategoryThunk());
      setCompanies(companyData);
   }, []);

   const handleCategoryClick = (categoryId) =>
   {
      window.location.href = `/jobList/${categoryId}`;
   };

   const handleCompanyClick = (companyId) =>
   {
      window.location.href = `/companyDetail/${companyId}`;
   };

   const handleMarkNotification = useCallback(
      debounce((id) =>
      {
         dispatch(readNotificationThunk(id));
      }, 500),
      [dispatch]
   );

   const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
   const toggleNotification = () =>
      setNotificationOpen((prevState) => !prevState); // Toggle dropdown thông báo

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
                     <li className="has-children">
                        <NavLink to="/viewAllJobs">Job Listings</NavLink>
                        <ul className="dropdown">
                           <li
                              className="dropdown-item"
                              onMouseEnter={() => setSkillsDropdownVisible(true)}
                              onMouseLeave={() => setSkillsDropdownVisible(false)}
                           >
                              <NavLink to="/viewAllSkill">
                                 Job By Skills <FaChevronRight className="icon" />
                              </NavLink>
                              {isSkillsDropdownVisible && (
                                 <div className="skills-dropdown">
                                    <div className="dropdown-columns">
                                       {Array.from({ length: 3 }).map((_, colIndex) => (
                                          <ul key={colIndex} className="sub-dropdown">
                                             {categories
                                                .slice(colIndex * 12, colIndex * 3 + 12)
                                                .map((category) => (
                                                   <li
                                                      key={category.categoryId}
                                                      onClick={() =>
                                                         handleCategoryClick(category.categoryId)
                                                      }
                                                   >
                                                      {category.categoryName}
                                                   </li>
                                                ))}
                                             {(colIndex + 1) * 15 <= categories.length && (
                                                <li
                                                   className="view-all"
                                                   onClick={() => navigate('/viewAllSkill')}
                                                >
                                                   View All Jobs by Skill <FaChevronRight className="icon2" />
                                                </li>
                                             )}
                                          </ul>
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </li>
                           <li
                              className="dropdown-item"
                              onMouseEnter={() => setCompanyDropdownVisible(true)}
                              onMouseLeave={() => setCompanyDropdownVisible(false)}
                           >
                              <NavLink to="/viewAllCompany">
                                 Job By Company<FaChevronRight className="icon3" />
                              </NavLink>
                              {isCompanyDropdownVisible && (
                                 <div className="skills-dropdown">
                                    <div className="dropdown-columns">
                                       {Array.from({ length: 3 }).map((_, colIndex) => (
                                          <ul key={colIndex} className="sub-dropdown">
                                             {companies
                                                .slice(colIndex * 12, colIndex * 3 + 12)
                                                .map((company) => (
                                                   <li
                                                      key={company.companyId}
                                                      onClick={() =>
                                                         handleCompanyClick(company.companyId)
                                                      }
                                                   >
                                                      {company.companyName}
                                                   </li>
                                                ))}
                                             {(colIndex + 1) * 15 <= companies.length && (
                                                <li
                                                   className="view-all"
                                                   onClick={() => navigate('/viewAllCompany')}
                                                >
                                                   View All Jobs by Company <FaChevronRight className="icon4" />
                                                </li>
                                             )}
                                          </ul>
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </li>
                        </ul>
                     </li>

                     <li className="has-children">
                        <NavLink to="/blogs">Blog</NavLink>
                        <ul className="dropdown">
                           {blogCategory.map((item) => (
                              <li key={item.id}>
                                 <NavLink
                                    to={`/blogs?type=${item.name}`}
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
                     {user && (
                        <li>
                           <NavLink to="/quiz">Quiz</NavLink>
                        </li>
                     )}
                     <li>
                        <NavLink to="/create-cv">Create CV</NavLink>
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
                                    className="notifications-item"
                                    onClick={
                                       !notification.read
                                          ? () =>
                                          {
                                             handleMarkNotification(notification.id);
                                             navigate(notification.url);
                                          }
                                          : () =>
                                          {
                                             navigate(notification.url);
                                          }
                                    }
                                 >
                                    <img src={notification.sender.imageUrl} alt="img" />
                                    <div className="text">
                                       <h4
                                          className={`${notification.read ? "" : "font-weight-bold"}`}
                                       >
                                          {notification.sender.firstName}{" "}
                                          {notification.sender.lastName}
                                       </h4>
                                       <p
                                          className={`${notification.read ? "" : "font-weight-bold"}`}
                                       >
                                          {notification.message}
                                       </p>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <p>No new notifications</p>
                           )}
                        </div>
                     )}
                     <Dropdown
                        isOpen={dropdownOpen}
                        toggle={toggleDropdown}
                        direction="down"
                     >
                        <DropdownToggle className="icon-person">
                           <FaUserCircle size={30} color="white" />
                        </DropdownToggle>
                        <DropdownMenu>
                           <DropdownItem>
                              <NavLink to="/profile">Profile</NavLink>
                           </DropdownItem>
                           <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                        </DropdownMenu>
                     </Dropdown>
                     {!user && (
                        <>
                           <NavLink
                              to="/login"
                              className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"
                           >
                              Log In
                           </NavLink>
                           <NavLink
                              to="/signup"
                              className="btn btn-primary ml-3 d-none d-lg-inline-block"
                           >
                              Sign Up
                           </NavLink>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </header>
   );
}

export default GlobalNavbar;
