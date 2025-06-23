import axios from "axios";
import { baseApiUrL } from "../config/webConfig";

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
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default request;
