import axiosRequest from "../configs/axiosConfig";

export const getAllBlog = async () => await axiosRequest.get("/blogs");

export const getAllBlogFilter = async (query, page, size) =>
  await axiosRequest.get(
    `/blogs/search?query=${query}&page=${page}&size=${size}`
  );

export const findBlogById = async (blogId) => {
  try {
    return await axiosRequest.get(`/blogs/${blogId}`);
  } catch (error) {
    console.log(error);
  }
};
