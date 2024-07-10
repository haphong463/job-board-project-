import axiosRequest from "../configs/axiosConfig";

const URL = "/blogs";
const HEADERS_FORM_DATA = {
  "Content-Type": "multipart/form-data",
};

export const getAllBlogs = async () => await axiosRequest.get(URL);

export const getAllBlogsByQuery = async (query, type, visibility, page, size) =>
  await axiosRequest.get(
    `${URL}/search?query=${query}&type=${type}&page=${page}&size=${size}&visibility=${visibility}`
  );

export const createBlog = async (data) =>
  await axiosRequest.post(URL, data, {
    headers: HEADERS_FORM_DATA,
  });

export const deleteBlog = async (blogId) =>
  await axiosRequest.delete(`${URL}/${blogId}`);

export const updateBlog = async (data, id) =>
  await axiosRequest.put(`${URL}/${id}`, data, {
    headers: HEADERS_FORM_DATA,
  });
