import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers["Authorization"] = `${token}`;
    }
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use((response) => response),
  (error) => Promise.reject(error);

export default api;
