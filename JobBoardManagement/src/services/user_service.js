import axiosRequest from "../configs/axiosConfig";

const URL = "/user";

export const getAllUserAsync = async (query, page, size) =>
  await axiosRequest.get(`${URL}/search?query=${query}&page=${page}&size=${size}`);
export const getUserByIDAsync = async (id) =>
  await axiosRequest.get(`${URL}/${id}`);

export const updateUserEnableStatusAsync = async (id, isEnabled) =>
  await axiosRequest.put(`${URL}/status/${id}`, isEnabled, {
    headers: {
      "Content-Type": "application/json",
    },
  });

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
