import axiosRequest from "../configs/axiosConfig";


export const getUserByIDAsync = async (id) =>
  await axiosRequest.get(`/users/${id}`);

export const updateUserAsync = async (data, id) =>
  await axiosRequest.put(`/users/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


  
export const getEducationByUserIdAsync = async (userId) =>
  await axiosRequest.get(`/users/education/${userId}`);
