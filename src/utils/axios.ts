import axios, { AxiosRequestConfig } from "axios";
import { refreshToken } from "../api/auth";

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:5000/v1/",
});

// Request Interceptor – attach access token
axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

axiosServices.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and refresh token available and retry not attempted
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        console.log("Access token expired. Trying refresh...");
        try {
          const res = await refreshToken({
            refreshToken: localStorage.getItem("refreshToken")!,
          });

          localStorage.setItem("accessToken", res.accessToken);

          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${res.accessToken}`;
          console.log("Refresh successful. Retrying original request...");
          isRefreshing = false;

          return axiosServices(originalRequest); // Retry original request
        } catch (err) {
          isRefreshing = false;
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }
    }

    // If no refresh possible or still unauthorized
    if (
      error.response?.status === 401 &&
      !window.location.href.includes("/login")
    ) {
      localStorage.clear();
      window.location.pathname = "/login";
    }

    return Promise.reject(
      (error.response && error.response.data) || "Wrong Services"
    );
  }
);

// Generic fetchers
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.get(url, { ...config });
  return res.data;
};

export const fetcherPost = async (
  args: string | [string, AxiosRequestConfig]
) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.post(url, { ...config });
  return res.data;
};

export default axiosServices;
