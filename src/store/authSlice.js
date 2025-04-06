import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../services/api";
import axios from "axios";

// Helper function to get user-friendly error message
const getErrorMessage = (error) => {
  if (typeof error === "string") return error;
  if (error.response?.data?.responseMessage) return error.response.data.responseMessage;
  return "Something went wrong. Please try again.";
};

export const login = createAsyncThunk("auth/login", async ({ phone, password, company_id }, { rejectWithValue }) => {
  try {
    const response = await authAPI.login({ phone, password, company_id });
    console.log(response.data);
    if (response.data.responseCode === 1) {
      const { token, user } = response.data.response;
      // Store token in AsyncStorage
      await AsyncStorage.setItem("token", token);

      return {
        responseCode: 1,
        message: response.data.responseMessage,
        data: {
          token,
          user,
          company_id: user.company_id,
          company_name: user.company_name,
        },
      };
    } else {
      return rejectWithValue({
        responseCode: response.data.responseCode,
        message: response.data.responseMessage || "Invalid credentials",
        response: response.data.response,
      });
    }
  } catch (error) {
    return rejectWithValue({
      responseCode: error.response?.data?.responseCode || 500,
      message: error.response?.data?.responseMessage || "Invalid phone number or password",
    });
  }
});

export const signup = createAsyncThunk("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await authAPI.signup(userData);
    if (response.data.responseCode === 1) {
      return response.data.response;
    }
    return rejectWithValue(response.data.responseMessage);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const verifyOTP = createAsyncThunk("auth/verifyOTP", async (data, { rejectWithValue }) => {
  try {
    const response = await authAPI.verifyOTP(data);

    if (response.data.responseCode === 1) {
      return response.data;
    }
    return rejectWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response?.data || { responseMessage: "Failed to verify OTP" });
  }
});

export const verifySignupOTP = createAsyncThunk("auth/verifySignupOTP", async ({ user_id, otp }, { rejectWithValue }) => {
  try {
    const response = await authAPI.verifyOTP({ user_id, otp });
    if (response.data.responseCode === 1) {
      return response.data.response;
    }
    return rejectWithValue(response.data.responseMessage);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await authAPI.forgotPassword(data);

    if (response.data.responseCode === 1) {
      return response.data.response;
    }
    return rejectWithValue(response.data.responseMessage);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await authAPI.resetPassword(data);

    if (response.data.responseCode === 1) {
      return response.data.response;
    }
    return rejectWithValue(response.data.responseMessage);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const checkToken = createAsyncThunk("auth/checkToken", async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No token found");
    }

    const response = await authAPI.checkToken();

    if (response.data.responseCode === 1) {
      return response.data.response;
    }
    return rejectWithValue(response.data.responseMessage);
  } catch (error) {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updatePassword = createAsyncThunk("auth/updatePassword", async ({ user_id, current_password, new_password }, { rejectWithValue }) => {
  try {
    const response = await authAPI.updatePassword({ user_id, current_password, new_password });
    if (response.data.responseCode === 1) {
      return response.data.response;
    }
    return rejectWithValue(response.data.responseMessage);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const initialState = {
  user: null,
  token: null,
  company: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  success: null,
  signupData: null,
  signupOtpVerified: {},
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
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = null;
      AsyncStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    initiateSignup: (state, action) => {
      state.signupData = action.payload;
      state.signupOtpVerified = false;
    },
    completeSignup: (state) => {
      state.isAuthenticated = false;
      if (state.signupData?.phone) {
        state.verifiedAccounts[state.signupData.phone] = true;
      }
      state.signupData = null;
      state.signupOtpVerified = false;
    },
    initializeAuth: () => {
      state.isAuthenticated = true;
    },
    addResetInfo: (state, action) => {
      state.resetFlow.contactInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.company = {
          id: action.payload.data.company_id,
          name: action.payload.data.company_name,
        };
        state.success = "Welcome back!";
      })
      .addCase(login.rejected, (state, action) => {
        state.signupOtpVerified = action.payload.response;
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.signupData = action.payload;
        state.success = "Account created successfully! Please verify your account.";
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.signupOtpVerified = true;
        state.success = "Account verified successfully!";
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resetFlow.otpSent = true;
        state.resetFlow.expectedOtp = action.payload.otp;
        state.success = "OTP sent successfully!";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetFlow = initialState.resetFlow;
        state.success = "Password reset successfully!";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Token
      .addCase(checkToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(checkToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.isValid;
        if (action.payload.isValid) {
          state.user = action.payload.user;
        }
      })
      .addCase(checkToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.company = null;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = "Password updated successfully!";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearSuccess, initiateSignup, completeSignup, addResetInfo } = authSlice.actions;

export default authSlice.reducer;
