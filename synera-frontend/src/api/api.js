// src/api/api.js
import axios from "axios";

// Base URL for Django backend
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", 
  withCredentials: true, // important for Gmail session

});

// Request interceptor: attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
