import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  signupData: null,
  signupOtpVerified: false,
  verifiedAccounts: {},
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
    login: (state, action) => {
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
    initiateSignup: (state, action) => {
      state.signupData = action.payload;
      state.signupOtpVerified = false;
    },
    verifySignupOTP: (state, action) => {
      if (action.payload && action.payload.length === 6) {
        state.signupOtpVerified = true;
      }
    },
    completeSignup: (state) => {
      state.isAuthenticated = false;
      if (state.signupData?.phoneNumber) {
        state.verifiedAccounts[state.signupData.phoneNumber] = true;
      }
      state.signupData = null;
      state.signupOtpVerified = false;
    },
    checkVerification: (state, action) => {
      const phoneNumber = action.payload;
      return {
        ...state,
        isVerified: state.verifiedAccounts[phoneNumber] || false,
      };
    },
  },
});

export const { 
  login, 
  initiateSignup, 
  verifySignupOTP, 
  completeSignup,
  logout, 
  sendOTP, 
  verifyOTP, 
  updatePassword, 
  clearResetFlow, 
  initializeAuth,
  checkVerification 
} = authSlice.actions;

export default authSlice.reducer;
