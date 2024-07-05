import axiosRequest from "../configs/axiosConfig";

const URL = "/user";

export const getAllUserAsync = async () => await axiosRequest.get(URL);
export const getUserByIDAsync = async (id) =>
  await axiosRequest.get(`${URL}/${id}`);

export const updateUserAsync = async (data, id) =>
  await axiosRequest.put(`${URL}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const signOutAsync = async (data) =>
  await axiosRequest.post("/auth/signout", {
    refreshToken: data,
  });
