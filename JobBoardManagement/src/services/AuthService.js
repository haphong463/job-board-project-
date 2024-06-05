import axiosRequest from "../configs/axiosConfig";

export const signIn = async (data) => {
  try {
    return await axiosRequest.post("/auth/signin", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
