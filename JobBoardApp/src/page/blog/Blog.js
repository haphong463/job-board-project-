import React, { useEffect, useState, useCallback } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import { calculateReadingTime } from "../../utils/function/readingTime";
import { Badge, Input } from "reactstrap";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBlog, fetchBlogs } from "../../features/blogSlice";
import "./style.css";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";
import { FaHome } from "react-icons/fa";

export const Blog = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogsFilter);
  const status = useSelector((state) => state.blogs.status);
  const error = useSelector((state) => state.blogs.error);
  const totalPages = useSelector((state) => state.blogs.totalPages);
  const [searchText, setSearchText] = useState("");
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 9;
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((query) => {
      setCurrentPage(0);
      dispatch(fetchBlogs({ query, page: currentPage, size: postsPerPage }));
    }, 500),
    [dispatch, currentPage]
  );

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    dispatch(
      fetchBlogs({ query: searchText, size: postsPerPage, page: currentPage })
    );
  }, [dispatch, currentPage]);

  const paginate = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <GlobalLayoutUser>
      <>
        <motion.section
          className="section-hero overlay inner-page bg-image"
          style={{
            backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
          }}
          id="home-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-10">
                <motion.h1
                  className="text-white font-weight-bold"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  JobBoard Blog - Ideas to develop your IT career
                </motion.h1>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Input
                    className="form-control form-control-lg sticky-top"
                    placeholder="Enter search keywords..."
                    onChange={handleSearchChange}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
        <section className="site-section">
          {/* {status === "loading" && <LoadingSpinner />} */}
          {/* {status === "failed" && (
            <h1 className="text-center">Error: {error}</h1>
          )} */}
          {blogs.length > 0 && (
            <div className="container">
              {searchText && <h1>Search results for: "{searchText}"</h1>}
              <div className="row mb-5">
                {blogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    className="mb-5 card-container col-lg-4 col-md-6 col-sm-12"
                    whileHover={{ y: -10 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="card h-100">
                      <NavLink to={`/blog/${blog.slug}`}>
                        <img
                          src={blog.imageUrl}
                          alt="Image"
                          className="rounded mb-4 card-img-top"
                          style={{
                            height: "auto",
                            width: "100%",
                          }}
                        />
                      </NavLink>
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title text-truncate-two">
                          <NavLink
                            to={`/blog/${blog.slug}`}
                            className="text-black"
                          >
                            {blog.title}
                          </NavLink>
                        </h6>
                        <div>
                          {blog.categories.slice(0, 3).map((item, index) => (
                            <Badge
                              key={item.id}
                              color="primary"
                              style={{
                                color: "white",
                                marginRight:
                                  index !== blog.categories.length - 1
                                    ? "10px"
                                    : "0px",
                              }}
                            >
                              {item.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="card-text mb-4 flex-grow-1 text-truncate-multiline">
                          {blog.citation}
                        </div>
                        <div>
                          {moment(blog.createdAt).format("MMMM DD, YYYY")}{" "}
                          <span className="mx-2 slash">•</span>
                          <span className="mx-2">
                            {`${calculateReadingTime(blog.content)} min`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="row pagination-wrap mt-5">
                <div className="col-md-12 text-center ">
                  <div className="custom-pagination ml-auto">
                    <motion.a
                      href="#top"
                      className={`prev ${currentPage === 0 ? "disabled" : ""}`}
                      onClick={() => paginate(currentPage - 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Prev
                    </motion.a>
                    <div className="d-inline-block">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <motion.a
                          key={i}
                          href={`#${i}`}
                          className={`${currentPage === i ? "active" : ""}`}
                          onClick={() => paginate(i)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {i + 1}
                        </motion.a>
                      ))}
                    </div>
                    <motion.a
                      href="#top"
                      className={`next ${
                        currentPage === totalPages - 1 ? "disabled" : ""
                      }`}
                      onClick={() => paginate(currentPage + 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Next
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          )}
          {blogs.length === 0 && (
            <motion.div
              className="text-center text-primary"
              style={{
                height: 250,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.h1
                className="text-primary"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                Something's wrong here...
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                We can't find any result for your search term.
              </motion.p>
              <motion.button
                className="btn btn-primary mt-3 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                onClick={() => navigate("/")} // Or useHistory() for react-router
              >
                <div className="d-flex justify-content-center align-items-center">
                  <FaHome className="mr-2" /> Go back to home
                </div>
              </motion.button>
            </motion.div>
          )}
        </section>
      </>
    </GlobalLayoutUser>
  );
};

export default Blog;
