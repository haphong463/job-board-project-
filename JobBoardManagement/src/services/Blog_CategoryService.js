import axiosRequest from "../configs/axiosConfig";

const URL = "/blog-category";

export const getAllBlogCategories = async () => {
  try {
    return await axiosRequest.get(URL);
  } catch (error) {
    console.log(error);
  }
};

export const createBlogCategory = async (data) => {
  try {
    return await axiosRequest.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
