import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://ecom-backend.plusdistribution.in/api"; // Update this to your actual backend URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem("authToken");
      // You might want to dispatch a logout action here
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // User Authentication
  login: (data) => {
    return api.post("/app/auth/login", data);
  },
  signup: (data) => api.post("/app/auth/signup", data),
  verifyOTP: (data) => api.post("/app/auth/verify-otp", data),
  resendOTP: (data) => api.post("/app/auth/resend-otp", data),

  // Password Management
  forgotPassword: (data) => {
    return api.post("/app/auth/forgot-password", data);
  },
  resetPassword: (data) => {
    return api.post("/app/auth/reset-password", data);
  },
  updatePassword: (data) => api.post("/app/auth/update-password", data),

  // Token Management
  checkToken: async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    return api.get("/app/auth/check-token", {
      headers: {
        Authorization: token,
      },
    });
  },
  refreshToken: () => api.post("/app/auth/refresh-token"),
};

export const API = {
  getProfile: () => api.get("/app/auth/profile"),
  updateProfile: (data) => api.put("/app/auth/profile", data),
  updatePhone: (data) => api.put("/app/auth/phone", data),
  updateEmail: (data) => api.put("/app/auth/email", data),
  updatePassword: (data) => api.post("/app/auth/update-password", data),
};

export default api;
