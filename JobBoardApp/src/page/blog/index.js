import React, { useEffect, useState } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBlog, fetchAllCategories } from "../../features/blogSlice";
import { NavLink, useSearchParams } from "react-router-dom";
import moment from "moment";
import { calculateReadingTime } from "../../utils/function/readingTime";
import "./style.css";
import { Badge, Input } from "reactstrap";
export const Blog = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("type"));
  const blogs = useSelector((state) => state.blogs.blogs);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    dispatch(fetchAllBlog());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

  const filterPosts = currentPosts.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(blogs.length / postsPerPage);

  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{
            backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
          }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Our Blog</h1>
                <div className="custom-breadcrumbs">
                  <a href="#">Home</a> <span className="mx-2 slash">/</span>
                  <span className="text-white">
                    <strong>About Us</strong>
                  </span>
                </div>
                <Input
                  className="form-control form-control-lg"
                  placeholder="search blog..."
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="site-section">
          {filterPosts && filterPosts.length > 0 ? (
            <div className="container">
              <div className="row mb-5">
                {filterPosts.map((blog) => (
                  <div key={blog.id} className="col-md-4 mb-5 card-container">
                    <div className="card h-100">
                      <NavLink to={`/blog/${blog.slug}`}>
                        <img
                          src={blog.imageUrl}
                          alt="Image"
                          className=" rounded mb-4 card-img-top"
                          style={{
                            height: 200,
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
                          <Badge
                            color="primary"
                            style={{
                              color: "white",
                            }}
                          >
                            {blog.category.name}
                          </Badge>
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
                          {/* Cần lấy ra số lượng comment của bài blog. */}
                          {/* <a href="#">{blog.blogCount}</a> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="row pagination-wrap mt-5">
                  <div className="col-md-12 text-center ">
                    <div className="custom-pagination ml-auto">
                      <a
                        href="#"
                        className={`prev ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                        onClick={() => paginate(currentPage - 1)}
                      >
                        Prev
                      </a>
                      <div className="d-inline-block">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <a
                            key={i}
                            href={`#${i + 1}`}
                            className={`${
                              currentPage === i + 1 ? "active" : ""
                            }`}
                            onClick={() => paginate(i + 1)}
                          >
                            {i + 1}
                          </a>
                        ))}
                      </div>
                      <a
                        href="#"
                        className={`next ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                        onClick={() => paginate(currentPage + 1)}
                      >
                        Next
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <h1
              className="text-center"
              style={{
                height: 250,
              }}
            >
              No data found
            </h1>
          )}
        </section>
      </>
    </GlobalLayoutUser>
  );
};
