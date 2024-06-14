import axiosRequest from "../configs/axiosConfig";
import {
  BAD_CREDENTIALS,
  GENERIC_ERROR,
  USER_NOT_FOUND,
} from "../utils/variables/errorType";

export const signInAsync = async (data) => {
  try {
    return await axiosRequest.post("/auth/signin", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    if (typeof error.response.data.message === "string") {
      switch (error.response.data.message) {
        case BAD_CREDENTIALS:
          return BAD_CREDENTIALS;
        case USER_NOT_FOUND:
          return USER_NOT_FOUND;
        default:
          return GENERIC_ERROR;
      }
    }
    return GENERIC_ERROR;
  }
};
