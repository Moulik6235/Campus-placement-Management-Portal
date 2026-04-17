import axios from "axios";

export const BASE_URL = "http://localhost:5000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

API.interceptors.request.use((req) => {
  const isAdminFrontend = window.location.pathname.startsWith('/admin');
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  if (isAdminFrontend && adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  } else if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  } else if (adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  }

  return req;
});

export default API;