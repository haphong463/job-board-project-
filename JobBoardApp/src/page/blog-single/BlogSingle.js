import React, { useEffect, useRef, useState } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById } from "../../features/blogSlice";
import {
  fetchAllCommentByBlogId,
  deleteComment,
  editComment,
  addComment,
} from "../../features/commentSlice";
import parse from "html-react-parser";
import { BlogContent } from "./BlogContent";
import { jwtDecode } from "jwt-decode";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

export const BlogSingle = () => {
  const dispatch = useDispatch();
  const blog = useSelector((state) => state.blogs.blog);
  const comments = useSelector((state) => state.comments.comments);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchBlogById(id));
    dispatch(fetchAllCommentByBlogId(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUser(decodedToken);
    }
  }, [accessToken]);

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const handleEditComment = (commentId, updatedContent) => {
    dispatch(editComment({ commentId, updatedContent }));
  };

  const handleAddComment = (newComment) => {
    dispatch(addComment(newComment));
  };

  return (
    <GlobalLayoutUser>
      <section
        className="section-hero overlay inner-page bg-image"
        style={{
          backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
        }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="custom-breadcrumbs mb-0">
                <span className="slash">Posted by</span> Admin
                <span className="mx-2 slash">•</span>
                <span className="text-white">
                  <strong>April 15, 2019</strong>
                </span>
              </div>
              <h1 className="text-white">{blog?.title}</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section" id="next-section">
        <div className="container">
          <div className="row">
            {blog ? (
              <div className="col-lg-8 blog-content">
                <h3 className="mb-4">{blog.title}</h3>
                <p>
                  <img
                    src={blog.imageUrl}
                    alt="Image"
                    className="img-fluid rounded"
                  />
                </p>
                <BlogContent content={blog.content} />
                <div className="pt-5">
                  <p>
                    Categories: <a href="#">Design</a>, <a href="#">Events</a>{" "}
                    Tags: <a href="#">#html</a>, <a href="#">#trends</a>
                  </p>
                </div>
                <div className="pt-5">
                  <h3 className="mb-5">{comments.length} Comments</h3>
                  <CommentList
                    comments={comments}
                    addComment={handleAddComment}
                    deleteComment={handleDeleteComment}
                    editComment={handleEditComment}
                    user={user}
                  />
                  <div className="comment-form-wrap pt-5">
                    <CommentForm
                      blogId={blog.id}
                      addComment={handleAddComment}
                      user={user}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-lg-8 blog-content">
                <h3 className="mb-4">Not found your blog.</h3>
              </div>
            )}
            <div className="col-lg-4 sidebar pl-lg-5">
              <div className="sidebar-box">
                <form action="#" className="search-form">
                  <div className="form-group">
                    <span className="icon fa fa-search" />
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Type a keyword and hit enter"
                    />
                  </div>
                </form>
              </div>
              <div className="sidebar-box">
                <img
                  src="../../../../assets/images/person_1.jpg"
                  alt="Image placeholder"
                  className="img-fluid mb-4 w-50 rounded-circle"
                />
                <h3>About The Author</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Ducimus itaque, autem necessitatibus voluptate quod mollitia
                  delectus aut, sunt placeat nam vero culpa sapiente consectetur
                  similique, inventore eos fugit cupiditate numquam!
                </p>
                <p>
                  <a href="#" className="btn btn-primary btn-sm">
                    Read More
                  </a>
                </p>
              </div>
              <div className="sidebar-box">
                <div className="categories">
                  <h3>Categories</h3>
                  <li>
                    <a href="#">
                      Creatives <span>(12)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      News <span>(22)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Design <span>(37)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      HTML <span>(42)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Web Development <span>(14)</span>
                    </a>
                  </li>
                </div>
              </div>
              <div className="sidebar-box">
                <h3>Paragraph</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Ducimus itaque, autem necessitatibus voluptate quod mollitia
                  delectus aut, sunt placeat nam vero culpa sapiente consectetur
                  similique, inventore eos fugit cupiditate numquam!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
};
