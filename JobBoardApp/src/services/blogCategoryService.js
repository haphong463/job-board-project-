import axiosRequest from "../configs/axiosConfig";

const URL = "/blog-category";
export const getAllBlogCategories = async () => {
  try {
    return await axiosRequest.get(URL);
  } catch (error) {
    return error;
  }
};
