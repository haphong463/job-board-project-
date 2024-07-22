import axiosRequest from "../configs/axiosConfig";

export const getAllBlog = async () => await axiosRequest.get("/blogs");

export const getAllBlogFilter = async (query, type, page, size) =>
  await axiosRequest.get(
    `/blogs/search?query=${query}&type=${type}&page=${page}&size=${size}`,
    {
      params: {
        visibility: 0,
      },
    }
  );

export const findBlogById = async (blogId) =>
  await axiosRequest.get(`/blogs/${blogId}`);
