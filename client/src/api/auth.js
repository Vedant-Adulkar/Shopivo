import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://shopivo.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupUser = (payload) => apiClient.post("/api/auth/signup", payload);

export const loginUser = (payload) => apiClient.post("/api/auth/login", payload);

export default apiClient;
