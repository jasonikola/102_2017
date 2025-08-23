import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
  console.log(error);
    const originalRequest = error.config;
    if (originalRequest.url?.includes("/auth/refresh")) {
      window.location.href = "/fact";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !error.config._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api.request(originalRequest);
      } catch {
        window.location.href = "/fact";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
