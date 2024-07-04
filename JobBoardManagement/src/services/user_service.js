import axiosRequest from "../configs/axiosConfig";

const URL = "/user";

export const getAllUserAsync = async () => await axiosRequest.get(URL);
export const getUserByIDAsync = async (id) => {
  try {
    return await axiosRequest.get(`${URL}/${id}`);
  } catch (error) {
    return error;
  }
};

export const updateUserAsync = async (data, id) => {
  try {
    return await axiosRequest.put(`${URL}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const signOutAsync = async (data) =>
  await axiosRequest.post("/auth/signout", {
    refreshToken: data,
  });





