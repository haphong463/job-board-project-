import axiosRequest from "../configs/axiosConfig";

export const fetchAllComentByBlogId = async (blogId) =>
  await axiosRequest.get(`/comments/blog/${blogId}`);

export const deleteCommentById = async (commentId) =>
  await axiosRequest.delete(`/comments/${commentId}`);

export const updateComment = async (commentId, data) =>
  await axiosRequest.put(`/comments/${commentId}`, data);
