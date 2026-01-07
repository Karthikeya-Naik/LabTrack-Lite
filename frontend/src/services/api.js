import axios from "axios";

const api = axios.create({
  baseURL: "https://labtrack-backend-05i5.onrender.com/api", // backend URL
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("labtrack_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
