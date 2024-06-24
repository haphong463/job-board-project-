import React, { useEffect, useState, useCallback } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { NavLink, useSearchParams } from "react-router-dom";
import moment from "moment";
import { calculateReadingTime } from "../../utils/function/readingTime";
import { Badge, Input } from "reactstrap";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../features/blogSlice";
import "./style.css";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";

const Blog = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogsFilter);
  const status = useSelector((state) => state.blogs.status);
  const error = useSelector((state) => state.blogs.error);
  const [searchText, setSearchText] = useState("");
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const handleSearch = useCallback(
    debounce((text) => {
      setCurrentPage(1);
      dispatch(fetchBlogs({ query: text, type: searchParams.get("type") }));
    }, 500),
    [dispatch, searchParams]
  );

  useEffect(() => {
    handleSearch(searchText);
  }, [searchText, handleSearch]);

  const paginate = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= Math.ceil(blogs.length / postsPerPage)
    ) {
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
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
        <section className="site-section">
          {status === "loading" && <LoadingSpinner />}
          {status === "failed" && (
            <h1 className="text-center">Error: {error}</h1>
          )}
          {status === "succeeded" && blogs.length > 0 && (
            <div className="container">
              {searchText && <h1>Search results for: "{searchText}"</h1>}
              <div className="row mb-5">
                {blogs
                  .slice(
                    (currentPage - 1) * postsPerPage,
                    currentPage * postsPerPage
                  )
                  .map((blog) => (
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
                      href="#"
                      className={`prev ${currentPage === 1 ? "disabled" : ""}`}
                      onClick={() => paginate(currentPage - 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Prev
                    </motion.a>
                    <div className="d-inline-block">
                      {Array.from(
                        { length: Math.ceil(blogs.length / postsPerPage) },
                        (_, i) => (
                          <motion.a
                            key={i}
                            href={`#${i + 1}`}
                            className={`${
                              currentPage === i + 1 ? "active" : ""
                            }`}
                            onClick={() => paginate(i + 1)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {i + 1}
                          </motion.a>
                        )
                      )}
                    </div>
                    <motion.a
                      href="#"
                      className={`next ${
                        currentPage === Math.ceil(blogs.length / postsPerPage)
                          ? "disabled"
                          : ""
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
          {status === "succeeded" && blogs.length === 0 && (
            <motion.h1
              className="text-center"
              style={{
                height: 250,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No data found
            </motion.h1>
          )}
        </section>
      </>
    </GlobalLayoutUser>
  );
};

export default Blog;
