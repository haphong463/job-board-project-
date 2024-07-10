import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "./CommentForm.css"; // Import CSS file
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendNotificationAsync } from "../../services/NotificationService";

export const CommentForm = ({ blogId, parentId = null, addComment, user }) => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const blog = useSelector((state) => state.blogs.blog);
  const handleSubmit = (e) => {
    e.preventDefault();
    const temporaryCommentId = `${Date.now()}`; // Generate a temporary unique ID based on the current timestamp

    const comment = {
      id: temporaryCommentId, // Assign the temporary ID to the new comment
      blog: { id: blogId },
      content,
      parent: parentId ? { id: parentId } : null,
      user: {
        username: user.sub,
      },
    };

    console.log(comment);
    addComment(comment);
    if (user.sub !== blog.user.username) {
      sendNotificationAsync({
        message: "commented on your post.",
        sender: {
          username: user.sub,
        },
        recipient: {
          username: blog.user.username,
        },
        url: `/blog/${blog.slug}#comment-${temporaryCommentId}`,
        isRead: false,
      });
    }
    setContent("");
  };
  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <textarea
          id="message"
          cols={30}
          rows={2}
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          required
          {...(parentId && { autoFocus: true })}
        />
        <button
          type={user ? "submit" : "button"}
          className="post-button"
          {...(!user && {
            onClick: () => {
              navigate("/login");
            },
          })}
        >
          {user ? (
            <FaPaperPlane />
          ) : (
            <span className="font-weight-bold">Sign in</span>
          )}
        </button>
      </div>
    </form>
  );
};
