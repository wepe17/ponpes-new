import axios from "axios";
import { getLocalStorage } from "../config/local-storage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Sesuaikan dengan base URL API Anda
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getLocalStorage("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
