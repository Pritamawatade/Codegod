import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${import.meta.env.VITE_SERVER_URL}/api/v1` : "/api/v1",
  withCredentials: true,
});