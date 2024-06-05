import axios from "axios";
const axiosRequest = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

// Request Interceptor for JWT
axiosRequest.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
axiosRequest.interceptors.response.use(
  (response) => response.data, // Automatically return response.data
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);
export default axiosRequest;
