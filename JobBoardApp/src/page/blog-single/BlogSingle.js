import React, { useEffect, useRef, useState } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBlog,
  fetchAllCategories,
  fetchBlogById,
} from "../../features/blogSlice";
import {
  fetchAllCommentByBlogId,
  deleteComment,
  editComment,
  addComment,
} from "../../features/commentSlice";
import { BlogContent } from "./BlogContent";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import moment from "moment";
import { BlogTitle } from "./BlogTitle";
import ReadingBar from "./ReadingBar";
import { calculateReadingTime } from "../../utils/function/readingTime";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../../services/WebSocketService";
import { BlogSideBar } from "./BlogSideBar";

export const BlogSingle = () => {
  const dispatch = useDispatch();
  const blog = useSelector((state) => state.blogs.blog);
  const blogs = useSelector((state) => state.blogs.blogs);
  const comments = useSelector((state) => state.comments.comments);
  const categories = useSelector((state) => state.blogs.categories);
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchBlogById(id)).unwrap(),
          dispatch(fetchAllCommentByBlogId(id)).unwrap(),
          categories.length === 0 && dispatch(fetchAllCategories()).unwrap(),
          blogs.length === 0 && dispatch(fetchAllBlog()).unwrap(),
        ]);

        console.log("The data has been loaded successfully.");
      } catch (error) {
        console.log("Error loading data", "error");
      }
    };
    fetchData();
  }, [dispatch, id]);
  useEffect(() => {
    if (blog && blog.content) {
      setReadingTime(calculateReadingTime(blog.content));
    }
  }, [blog]);
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const handleEditComment = (commentId, updatedContent) => {
    dispatch(editComment({ commentId, updatedContent }));
  };

  const handleAddComment = (newComment) => {
    const payload = dispatch(addComment(newComment));
    return payload;
  };

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
                    <span className="mx-2 slash">•</span>
                    <span className="text-white">{readingTime} min read</span>
                  </div>
                  <BlogTitle title={blog.title} />
                </div>
              </div>
            </div>
          </section>
          <section className="site-section" id="next-section">
            <ReadingBar />
            <div className="container">
              <div className="row">
                <div className="col-lg-8 blog-content">
                  <h3 className="mb-4">{blog.title}</h3>
                  <p className="text-center">
                    <img
                      src={blog.imageUrl}
                      alt="Image"
                      className="img-fluid rounded"
                      style={{
                        width: "100%",
                      }}
                    />
                  </p>
                  <i>{blog.citation}</i>
                  <hr />
                  <BlogContent content={blog.content} />
                  <div className="pt-5">
                    <hr />
                    <p className="font-weight-bold text-right">
                      Updated on:{" "}
                      {moment(blog.updatedAt).format("MMMM Do YYYY")}
                    </p>
                    {/* <p>
                      Categories: <a href="#">Design</a>, <a href="#">Events</a>{" "}
                      Tags: <a href="#">#html</a>, <a href="#">#trends</a>
                    </p> */}
                  </div>
                  <div className="pt-5">
                    {comments.length > 0 ? (
                      <>
                        <h3 className="mb-5">{comments.length} Comments</h3>
                        <CommentList
                          comments={comments}
                          addComment={handleAddComment}
                          deleteComment={handleDeleteComment}
                          editComment={handleEditComment}
                          user={user}
                        />
                      </>
                    ) : (
                      <p className="font-weight-bold">No comments yet.</p>
                    )}
                    <div className="comment-form-wrap pt-5">
                      <CommentForm
                        blogId={blog.id}
                        addComment={handleAddComment}
                        user={user}
                      />
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
