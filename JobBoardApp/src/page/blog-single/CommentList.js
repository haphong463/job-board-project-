import { Comment } from "./Comment";

export const CommentList = ({
  comments,
  addComment,
  deleteComment,
  editComment,
  user,
}) => {
  return (
    <ul className="comment-list">
      {comments.map((comment, key) => (
        <Comment
          key={key}
          comment={comment}
          addComment={addComment}
          deleteComment={deleteComment}
          editComment={editComment}
          user={user}
        />
      ))}
    </ul>
  );
};
