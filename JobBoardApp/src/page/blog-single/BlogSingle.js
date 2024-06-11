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
import { BlogContent } from "./BlogContent";
import { jwtDecode } from "jwt-decode";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import {
  resetUserAndRoles,
  updateUserAndRoles,
} from "../../features/authSlice";
import moment from "moment";
import { BlogSideBar } from "./BlogSideBar";
import { BlogTitle } from "./BlogTitle";

export const BlogSingle = () => {
  const dispatch = useDispatch();
  const blog = useSelector((state) => state.blogs.blog);
  const comments = useSelector((state) => state.comments.comments);
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  // const fullName = useSelector((state) => state.blogs.fullName);
  useEffect(() => {
    dispatch(fetchBlogById(id));
    dispatch(fetchAllCommentByBlogId(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!user) {
      dispatch(updateUserAndRoles());
    }
  }, [user, dispatch]);

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const handleEditComment = (commentId, updatedContent) => {
    dispatch(editComment({ commentId, updatedContent }));
  };

  const handleAddComment = (newComment) => {
    dispatch(addComment(newComment));
  };
  console.log(blog);

  return (
    <GlobalLayoutUser>
      {blog && (
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
                <div className="col-md-12">
                  <div className="custom-breadcrumbs mb-0">
                    <span className="slash">Posted by</span>{" "}
                    <span className="text-white">
                      {blog.user.firstName} {blog.user.lastName}
                    </span>
                    <span className="mx-2 slash">•</span>
                    <span className="text-white">
                      <strong>
                        {moment(blog.createdAt).format("MMMM Do YYYY")}
                      </strong>
                    </span>
                  </div>
                  <BlogTitle title={blog.title} />
                </div>
              </div>
            </div>
          </section>
          <section className="site-section" id="next-section">
            <div className="container">
              <div className="row">
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
                      {user ? (
                        <CommentForm
                          blogId={blog.id}
                          addComment={handleAddComment}
                          user={user}
                        />
                      ) : (
                        <div className="d-flex justify-content-center">
                          <button className="btn btn-primary btn-lg">
                            Sign up to comment on our blog
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <BlogSideBar />
              </div>
            </div>
          </section>
        </>
      )}
    </GlobalLayoutUser>
  );
};
