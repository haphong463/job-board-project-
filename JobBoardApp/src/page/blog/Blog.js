import React, { useEffect } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBlog } from "../../features/blogSlice";
import { NavLink } from "react-router-dom";
import moment from "moment";

export const Blog = () => {
  const dispatch = useDispatch();
  // const blog
  const blogs = useSelector((state) => state.blogs.blogs);
  const blogStatus = useSelector((state) => state.blogs.status);
  useEffect(() => {
    dispatch(fetchAllBlog());
    if (blogs) {
      console.log(blogs);
    }
  }, []);

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
              </div>
            </div>
          </div>
        </section>
        <section className="site-section">
          {blogs && (
            <div className="container">
              <div className="row mb-5">
                {blogs.map((blog) => {
                  console.log(">>>blog: ", blog);
                  return (
                    <div key={blog.id} className="col-md-6 col-lg-4 mb-5">
                      <NavLink to={`/blog/${blog.slug}`}>
                        <img
                          src={blog.thumbnailUrl}
                          alt="Image"
                          style={{
                            height: 300,
                            width: 300,
                          }}
                          className="img-thumbnail rounded mb-4"
                        />
                      </NavLink>
                      <h3>
                        <a href="blog-single.html" className="text-black">
                          {blog.title}
                        </a>
                      </h3>
                      <div>
                        {moment(blog.createdAt).format("MMMM Do YYYY")}{" "}
                        <span className="mx-2">
                          {blog.commentCount} comments
                        </span>
                        {/* Cần lấy ra số lượng comment của bài blog. */}
                        {/* <a href="#">{blog.blogCount}</a> */}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="row pagination-wrap mt-5">
                <div className="col-md-12 text-center ">
                  <div className="custom-pagination ml-auto">
                    <a href="#" className="prev">
                      Prev
                    </a>
                    <div className="d-inline-block">
                      <a href="#" className="active">
                        1
                      </a>
                      <a href="#">2</a>
                      <a href="#">3</a>
                      <a href="#">4</a>
                    </div>
                    <a href="#" className="next">
                      Next
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </>
    </GlobalLayoutUser>
  );
};
