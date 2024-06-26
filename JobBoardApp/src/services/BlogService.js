import axiosRequest from "../configs/axiosConfig";

export const getAllBlog = async () => {
  try {
    return await axiosRequest.get("/blogs");
  } catch (error) {
    console.log(error);
  }
};

export const getAllBlogFilter = async (params) => {
  try {
    return await axiosRequest.get("/blogs/search", {
      params,
    });
  } catch (error) {
    console.log(error);
  }
};

export const findBlogById = async (blogId) => {
  try {
    return await axiosRequest.get(`/blogs/${blogId}`);
  } catch (error) {
    console.log(error);
  }
};
