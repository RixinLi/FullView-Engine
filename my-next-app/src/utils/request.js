import axios from "axios";
import { baseApiUrL } from "../config/webConfig";

// router

// 创建request工具用于发起请求
const request = axios.create({
  baseURL: baseApiUrL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // token过期 401
    if (error.response?.status === 401) {
      console.warn("未授权，跳转到登录页");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/auth/sign-in";
    }
    if (error.response?.status === 429) {
      alert("登录操作太频繁");
      window.location.href = "/auth/sign-in";
    }

    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default request;
