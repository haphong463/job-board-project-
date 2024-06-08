import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "./CommentForm.css"; // Import CSS file

export const CommentForm = ({ blogId, parentId = null, addComment, user }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const comment = {
      blog: { id: blogId },
      content,
      parent: parentId ? { id: parentId } : null,
      user: {
        username: user.sub,
      },
    };
    console.log(comment);
    addComment(comment);
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
        />
        <button type="submit" className="post-button">
          <FaPaperPlane />
        </button>
      </div>
    </form>
  );
};
