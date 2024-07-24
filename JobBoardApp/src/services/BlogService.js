import axiosRequest from "../configs/axiosConfig";

export const getAllBlog = async () => await axiosRequest.get("/blogs");

export const getAllBlogFilter = async (
  query,
  type,
  page,
  size,
  order = "asc"
) =>
  await axiosRequest.get(`/blogs/search`, {
    params: {
      visibility: 0,
      query,
      type,
      page,
      size,
      order,
    },
  });

export const findBlogById = async (blogId) =>
  await axiosRequest.get(`/blogs/${blogId}`);
