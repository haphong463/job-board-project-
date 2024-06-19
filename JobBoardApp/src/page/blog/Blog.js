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
  const blogs = useSelector((state) => state.blogs.blogs);
  const [searchText, setSearchText] = useState("");
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const typeParam = searchParams.get("type")?.toLowerCase() || "";
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAllBlog()).unwrap(),
          dispatch(fetchAllCategories()).unwrap(),
        ]);
        console.log("Fetch blog data ok!");
      } catch (error) {
        console.log(error);
      }
    };
    if (blogs.length === 0) {
      fetchData();
    }
  }, [dispatch]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

  const filterPosts = currentPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.categories.some((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        ) ||
        blog.categories.some((item) =>
          item.name.toLowerCase().includes(typeParam)
        )
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
              <div className="col-md-10">
                <h1 className="text-white font-weight-bold">
                  JobBoard Blog - Ideas to develop your IT career
                </h1>

                <Input
                  className="form-control form-control-lg sticky-top"
                  placeholder="Enter search keywords..."
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="site-section">
          {filterPosts && filterPosts.length > 0 ? (
            <div className="container">
              <h1>Latest</h1>
              <div className="row mb-5">
                {filterPosts.slice(0, 3).map((blog, index) => (
                  <div key={blog.id} className="mb-5 card-container col-md-4">
                    <div className="card h-100">
                      <NavLink to={`/blog/${blog.slug}`}>
                        <img
                          src={blog.imageUrl}
                          alt="Image"
                          className="rounded mb-4 card-img-top"
                          style={{
                            height: 200,
                            width: "100%",
                          }}
                        />
                      </NavLink>
                      <div className="card-body d-flex flex-column">
                        <h6
                          className="card-title 
                           text-truncate-two"
                        >
                          <NavLink
                            to={`/blog/${blog.slug}`}
                            className="text-black"
                          >
                            {blog.title}
                          </NavLink>
                        </h6>
                        <div>
                          {blog.categories.map((item, index) => (
                            <Badge
                              key={item.id} // Đảm bảo mỗi phần tử có key duy nhất
                              color="primary"
                              style={{
                                color: "white",
                                marginRight:
                                  index !== blog.categories.length - 1
                                    ? "10px"
                                    : "0px", // Thêm margin-right ngoại trừ phần tử cuối cùng
                              }}
                              className=""
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

export default Blog;
