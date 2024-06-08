import { useState, useEffect } from "react";
import { CommentForm } from "./CommentForm";
import { FaEllipsisH, FaPaperPlane } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import "./Comment.css";
import Swal from "sweetalert2";

export const Comment = ({
  comment,
  addComment,
  deleteComment,
  editComment,
  user,
  level = 0,
  maxLevel = 3,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [originalContent, setOriginalContent] = useState(comment.content); // Lưu nội dung ban đầu
  const [timeSinceComment, setTimeSinceComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const calculateTimeSinceComment = () => {
      const now = new Date();
      const commentDate = new Date(comment.createdAt);
      const diffMs = now - commentDate;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) {
        setTimeSinceComment(`${diffMins} minutes ago`);
      } else if (diffHours < 24) {
        setTimeSinceComment(`${diffHours} hours ago`);
      } else if (diffDays < 7) {
        setTimeSinceComment(`${diffDays} days ago`);
      } else {
        const diffWeeks = Math.floor(diffDays / 7);
        setTimeSinceComment(`${diffWeeks} weeks ago`);
      }
    };

    calculateTimeSinceComment();

    // Set up interval to update time every 1 minute and 30 seconds
    const interval = setInterval(calculateTimeSinceComment, 90000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editComment(comment.id, editedContent);
    setShowEditForm(false);
    setIsEditing(false); // Đặt biến trạng thái về false khi chỉnh sửa hoàn thành
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
        deleteComment(comment.id);
      }
    });
  };

  const handleFormEditKeyDown = (e) => {
    // Ngăn chặn hiển thị sweetalert2 khi người dùng đang chỉnh sửa
    if (e.key === "Escape" && !isEditing) {
      if (editedContent !== originalContent) {
        // Nếu có sự thay đổi, hiển thị sweetalert2 để xác nhận lưu
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
            // Nếu người dùng chọn lưu, thực hiện submit form chỉnh sửa
            handleEditSubmit(e);
          } else {
            // Nếu người dùng chọn không lưu, đặt nội dung chỉnh sửa về nội dung ban đầu
            setEditedContent(originalContent);
            setShowEditForm(false);
          }
        });
      } else {
        // Nếu không có sự thay đổi, đóng form chỉnh sửa
        setShowEditForm(false);
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
          <div
            className="comment-actions"
            style={{
              cursor: "pointer",
            }}
          >
            <Dropdown>
              <Dropdown.Toggle as="a" className="options-toggle">
                <FaEllipsisH />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowEditForm(!showEditForm)}>
                  {showEditForm ? "Cancel" : "Edit"}
                </Dropdown.Item>
                <Dropdown.Item onClick={confirmDelete}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="meta">{timeSinceComment}</div>
        {showEditForm ? (
          <form onSubmit={handleEditSubmit} className="comment-form">
            <div
              className="form-group"
              style={{
                padding: 0,
                margin: 0,
              }}
            >
              <textarea
                id="message"
                cols={30}
                rows={2}
                className="form-control"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
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
          <p>{comment.content}</p>
        )}

        {level < maxLevel && (
          <p>
            <a
              className="reply mr-3"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              {showReplyForm ? "Cancel" : "Reply"}
            </a>
            {comment.children && comment.children.length > 0 && (
              <a className="reply" onClick={() => setShowReplies(!showReplies)}>
                {showReplies ? "Hide" : "Show"} replies
              </a>
            )}
          </p>
        )}
        {showReplyForm && level < maxLevel && (
          <CommentForm
            parentId={comment.id}
            blogId={comment.blog.id}
            addComment={addComment}
            user={user}
          />
        )}
        {showReplies && (
          <ul className="children">
            {comment.children.map((reply, key) => (
              <Comment
                key={key}
                comment={reply}
                addComment={addComment}
                deleteComment={deleteComment}
                editComment={editComment}
                user={user}
                level={level + 1}
                maxLevel={maxLevel}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};
