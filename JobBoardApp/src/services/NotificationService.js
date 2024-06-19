import axiosRequest from "../configs/axiosConfig";

export const getNotificationAsync = async (id) => {
  try {
    return await axiosRequest.get(`/notifications/${id}`);
  } catch (error) {
    return error;
  }
};

export const sendNotificationAsync = async (data) => {
  try {
    return await axiosRequest.post(`/notifications/send`, data);
  } catch (error) {
    return error;
  }
};
