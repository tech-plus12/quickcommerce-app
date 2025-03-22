import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  resetFlow: {
    contactInfo: null,
    otpSent: false,
    otpVerified: false,
    expectedOtp: "123456",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      state.isAuthenticated = true;
    },
    login: (state) => {
      state.isAuthenticated = true;
      AsyncStorage.setItem("authToken", "dummyToken");
    },
    signup: (state) => {
      state.isAuthenticated = true;
      AsyncStorage.setItem("authToken", "dummyToken");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      AsyncStorage.removeItem("authToken");
    },
    sendOTP: (state, action) => {
      state.resetFlow = {
        ...state.resetFlow,
        contactInfo: action.payload,
        otpSent: true,
        otpVerified: false,
        expectedOtp: "123456",
      };
    },
    verifyOTP: (state, action) => {
      if (action.payload === state.resetFlow.expectedOtp) {
        state.resetFlow.otpVerified = true;
      }
    },
    updatePassword: (state) => {
      state.resetFlow = initialState.resetFlow;
    },
    clearResetFlow: (state) => {
      state.resetFlow = initialState.resetFlow;
    },
  },
});

export const { login, signup, logout, sendOTP, verifyOTP, updatePassword, clearResetFlow, initializeAuth } = authSlice.actions;

export default authSlice.reducer;
