import axiosRequest from "../configs/axiosConfig";

export const findBlogById = async (blogId) =>
  await axiosRequest.get(`/blogs/${blogId}`);
