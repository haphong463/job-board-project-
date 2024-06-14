import axiosRequest from "../configs/axiosConfig";

const URL = "/users";

export const getAllUserAsync = async () => {
  try {
    return await axiosRequest.get(URL);
  } catch (error) {
    return error;
  }
};
