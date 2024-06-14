import axiosRequest from "../configs/axiosConfig";

const URL = "/blogs";
const HEADERS_FORM_DATA = {
  "Content-Type": "multipart/form-data",
};

const HEADERS_FORM_JSON_APPLICATION = {
  "Content-Type": "application/json",
};

export const getAllBlogs = async () => {
  try {
    return await axiosRequest.get(URL);
  } catch (error) {
    console.log(error);
  }
};

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
