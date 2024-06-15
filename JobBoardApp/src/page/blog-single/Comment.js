import { useEffect } from "react";
import { CommentForm } from "./CommentForm";
import { FaEllipsisH, FaPaperPlane } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import "./Comment.css";
import Swal from "sweetalert2";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleShowReplies,
  toggleShowReplyForm,
  toggleShowEditForm,
  setEditedContent,
  setOriginalContent,
  editComment as editCommentAction,
  deleteComment as deleteCommentAction,
} from "../../features/commentSlice";
import { AnimatePresence, motion } from "framer-motion";
export const Comment = ({
  comment,
  addComment,
  user,
  level = 0,
  maxLevel = 2,
}) => {
  const dispatch = useDispatch();
  const showReplies = useSelector(
    (state) => state.comments.showReplies[comment.id]
  );
  const showReplyForm = useSelector(
    (state) => state.comments.showReplyForm[comment.id]
  );
  const showEditForm = useSelector(
    (state) => state.comments.showEditForm[comment.id]
  );
  const editedContent = useSelector(
    (state) => state.comments.editedContent[comment.id]
  );
  const originalContent = useSelector(
    (state) => state.comments.originalContent[comment.id]
  );

  useEffect(() => {
    const interval = setInterval(() => {}, 90000);
    return () => clearInterval(interval);
  }, []);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(
      editCommentAction({
        commentId: comment.id,
        updatedContent: editedContent,
      })
    );
    dispatch(toggleShowEditForm({ commentId: comment.id }));
  };

  const confirmDelete = () => {
    Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCommentAction(comment.id));
      }
    });
  };

  const handleFormEditKeyDown = (e) => {
    if (e.key === "Escape") {
      if (editedContent !== originalContent) {
        Swal.fire({
          title: "Save changes?",
          text: "Do you want to save changes?",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            handleEditSubmit(e);
          } else {
            dispatch(
              setEditedContent({
                commentId: comment.id,
                content: originalContent,
              })
            );
            dispatch(toggleShowEditForm({ commentId: comment.id }));
          }
        });
      } else {
        dispatch(toggleShowEditForm({ commentId: comment.id }));
      }
    }
  };

  return (
    <li className={`comment level-${level}`}>
      <div className="vcard bio">
        <img
          src="../../../../assets/images/person_2.jpg"
          alt="Image placeholder"
        />
      </div>
      <div className="comment-body">
        <div className="d-flex justify-content-between">
          <h3>{`${comment.user.firstName} ${comment.user.lastName}`}</h3>
          {user && user.sub === comment.user.username && (
            <div className="comment-actions" style={{ cursor: "pointer" }}>
              <Dropdown>
                <Dropdown.Toggle as="a" className="options-toggle">
                  <FaEllipsisH />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      dispatch(toggleShowEditForm({ commentId: comment.id }))
                    }
                  >
                    {showEditForm ? "Cancel" : "Edit"}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={confirmDelete}>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>
        <div className="meta">{moment(comment.createdAt).fromNow()}</div>
        {showEditForm ? (
          <form onSubmit={handleEditSubmit} className="comment-form">
            <div className="form-group" style={{ padding: 0, margin: 0 }}>
              <textarea
                id="message"
                cols={30}
                rows={2}
                className="form-control"
                value={editedContent || ""}
                onChange={(e) =>
                  dispatch(
                    setEditedContent({
                      commentId: comment.id,
                      content: e.target.value,
                    })
                  )
                }
                placeholder="Write a comment..."
                required
                autoFocus
                onKeyDown={handleFormEditKeyDown}
              />
              <button type="submit" className="post-button">
                <FaPaperPlane />
              </button>
            </div>
            <small>Press ESC to cancel.</small>
          </form>
        ) : (
          <p style={{ whiteSpace: "pre-line" }}>{comment.content}</p>
        )}
        {level < maxLevel && (
          <p>
            {user && (
              <span
                className="mr-3"
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() =>
                  dispatch(toggleShowReplyForm({ commentId: comment.id }))
                }
              >
                {showReplyForm ? "Cancel" : "Reply"}
              </span>
            )}
            {comment.children && comment.children.length > 0 && (
              <span
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() =>
                  dispatch(toggleShowReplies({ commentId: comment.id }))
                }
              >
                {showReplies ? "Hide" : "Show"} replies
              </span>
            )}
          </p>
        )}
        {showReplyForm && level < maxLevel && (
          <AnimatePresence>
            {showReplyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CommentForm
                  parentId={comment.id}
                  blogId={comment.blog.id}
                  addComment={addComment}
                  user={user}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {showReplies && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ul className="children">
                {comment.children.map((reply, key) => (
                  <Comment
                    key={key}
                    comment={reply}
                    addComment={addComment}
                    user={user}
                    level={level + 1}
                    maxLevel={maxLevel}
                  />
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </li>
  );
};
