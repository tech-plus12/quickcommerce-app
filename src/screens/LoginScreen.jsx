import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  login,
  signup,
  verifyOTP,
  resetPassword,
  addResetInfo,
  updatePassword,
  initiateSignup,
  completeSignup,
  clearError,
  clearSuccess,
  forgotPassword,
} from "../store/authSlice";
import Icon from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const LoginSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const OTPSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const NewPasswordSchema = Yup.object().shape({
  newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ForgotPasswordSchema = Yup.object().shape({
  contactType: Yup.string().oneOf(["email", "phone"]).required(),
  contact: Yup.string().when("contactType", {
    is: "email",
    then: () => Yup.string().email("Invalid email format").required("Email is required"),
    otherwise: () =>
      Yup.string()
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
  }),
});

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [secureLoginPassword, setSecureLoginPassword] = useState(true);
  const [secureSignupPassword, setSecureSignupPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const scrollViewRef = useRef(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [resetStep, setResetStep] = useState(0);
  const [contactInfo, setContactInfo] = useState({ type: "email", value: "" });
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [showSignupOTP, setShowSignupOTP] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState(null);
  const [signupData, setSignupData] = useState(null);
  const { error, success, isLoading, resetFlow } = useSelector((state) => state.auth);

  const signupOtpVerified = useSelector((state) => state.auth.signupOtpVerified);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: success,
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });
      dispatch(clearSuccess());
    }
  }, [success]);

  const handleCloseModal = () => {
    setForgotPasswordVisible(false);
    setResetStep(0);
    setContactInfo({ type: "email", value: "" });
    // Reset password visibility states
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleAuthMode = () => {
    // Scroll to top when switching modes
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }

    Animated.timing(animation, {
      toValue: isLogin ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsLogin(!isLogin);
  };

  const formatPhoneNumber = (text, setFieldValue) => {
    const cleaned = text.replace(/\D/g, "");
    setFieldValue("phoneNumber", cleaned);
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(
        login({
          phone: values.phoneNumber,
          password: values.password,
          company_id: "67e920003c16eb613ed5e8a9",
        })
      ).unwrap();

      if (response.responseCode === 1) {
        // Token is already stored in AsyncStorage by the login thunk
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.message || "Login successful!",
          position: "bottom",
        });
        // Navigate to Main screen after successful login
        navigation.replace("Main");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.message || "Invalid credentials",
          position: "bottom",
        });
      }
    } catch (error) {
      if (!error.response.is_verified) {
        setShowVerificationModal(true);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.message || "Invalid credentials",
          position: "bottom",
        });
        return;
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Invalid phone number or password",
        position: "bottom",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const signupData = {
        name: values.name,
        email: values.email,
        phone: values.phoneNumber,
        password: values.password,
        company_id: "67e920003c16eb613ed5e8a9", // Hardcoded company ID
      };

      const response = await dispatch(signup(signupData)).unwrap();

      // Store the signup data for OTP verification
      setSignupData({
        ...signupData,
        user_id: response.user_id,
        company_id: response.company_id,
      });
      setShowSignupOTP(true);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
    }
  };

  const handleSignupOTPVerification = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(
        verifyOTP({
          user_id: signupData.user_id,
          otp: values.otp,
          company_id: signupData.company_id,
        })
      ).unwrap();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account created successfully",
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });

      dispatch(completeSignup());
      setShowSignupOTP(false);
      setSignupData(null);
      toggleAuthMode();
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to verify OTP",
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const handleForgotPassword = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(
        forgotPassword({
          contactType: values.contactType,
          contact: values.contact,
          company_id: "67e920003c16eb613ed5e8a9",
        })
      ).unwrap();

      dispatch(addResetInfo(response));
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "OTP sent successfully!",
        position: "bottom",
      });
      setResetStep(1);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to send OTP. Please try again.",
        position: "bottom",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(
        resetPassword({
          user_id: "67e920003c16eb613ed5e8a9",
          otp: values.otp,
          new_password: values.newPassword,
        })
      ).unwrap();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password reset successfully!",
        position: "bottom",
      });
      setResetStep(0);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to reset password. Please try again.",
        position: "bottom",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Animation interpolation
  const slideAnim = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  const handleInputFocus = (fieldName) => {
    setFocusedInput(fieldName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const renderForgotPasswordContent = () => {
    switch (resetStep) {
      case 0:
        return (
          <Formik
            initialValues={{ contactType: "email", contact: "" }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={(values, formikBag) => {
              handleForgotPassword(values, formikBag);
            }}
          >
            {({ handleSubmit, values, setFieldValue, errors, touched, handleBlur, isSubmitting }) => (
              <>
                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    style={[styles.segmentButton, values.contactType === "email" && styles.segmentButtonActive]}
                    onPress={() => {
                      setFieldValue("contactType", "email");
                      setFieldValue("contact", emailValue);
                    }}
                  >
                    <Text style={[styles.segmentText, values.contactType === "email" && styles.segmentTextActive]}>Email</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.segmentButton, values.contactType === "phone" && styles.segmentButtonActive]}
                    onPress={() => {
                      setFieldValue("contactType", "phone");
                      setFieldValue("contact", phoneValue);
                    }}
                  >
                    <Text style={[styles.segmentText, values.contactType === "phone" && styles.segmentTextActive]}>Phone</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{values.contactType === "email" ? "Email Address" : "Phone Number"}</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedInput === "resetContact" && styles.inputFocused,
                      touched.contact && errors.contact && styles.inputError,
                    ]}
                  >
                    <Icon
                      name={values.contactType === "email" ? "mail" : "smartphone"}
                      size={20}
                      color={focusedInput === "resetContact" ? "#5B37B7" : "#666666"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={values.contact}
                      onChangeText={(text) => {
                        if (values.contactType === "phone") {
                          const cleaned = text.replace(/[^0-9]/g, "");
                          setFieldValue("contact", cleaned);
                          setPhoneValue(cleaned);
                        } else {
                          setFieldValue("contact", text);
                          setEmailValue(text);
                        }
                      }}
                      onFocus={() => handleInputFocus("resetContact")}
                      onBlur={() => {
                        handleInputBlur();
                        handleBlur("contact");
                      }}
                      placeholder={values.contactType === "email" ? "Enter your email" : "Enter your phone number"}
                      keyboardType={values.contactType === "email" ? "email-address" : "numeric"}
                      maxLength={values.contactType === "phone" ? 10 : undefined}
                    />
                  </View>
                  {touched.contact && errors.contact && (
                    <Text style={styles.errorText}>
                      <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.contact}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.resetButton, (!values.contact || isSubmitting) && styles.authButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={!values.contact || isSubmitting}
                >
                  {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.resetButtonText}>Send OTP</Text>}
                </TouchableOpacity>
              </>
            )}
          </Formik>
        );

      case 1:
        return (
          <Formik
            initialValues={{ otp: "", newPassword: "", confirmPassword: "" }}
            validationSchema={Yup.object().shape({
              otp: Yup.string()
                .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
                .required("OTP is required"),
              newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Passwords must match")
                .required("Confirm password is required"),
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const resetData = {
                  user_id: resetFlow.contactInfo.user_id,
                  otp: values.otp,
                  new_password: values.newPassword,
                  company_id: resetFlow.contactInfo.company_id,
                };

                const response = await dispatch(resetPassword(resetData)).unwrap();

                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "Password reset successfully",
                  position: "top",
                  visibilityTime: 4000,
                  autoHide: true,
                });

                // Reset form and close modal
                resetForm();
                setForgotPasswordVisible(false);
                setContactInfo({ type: "email", value: "", user_id: null, company_id: null });
                setShowNewPassword(false);
                setShowConfirmPassword(false);
                setSubmitting(false);
                setResetStep(0);
              } catch (error) {
                setSubmitting(false);

                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: error.message || "Failed to reset password",
                  position: "top",
                  visibilityTime: 4000,
                  autoHide: true,
                });
              }
            }}
          >
            {({ handleSubmit, values, handleChange, errors, touched, handleBlur, isSubmitting }) => (
              <>
                <Text style={styles.modalSubtitle}>
                  Enter the 6-digit code sent to your {contactInfo.type}:<Text style={{ fontWeight: "bold" }}> {contactInfo.value}</Text>
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>OTP Code</Text>
                  <View style={[styles.inputWrapper, focusedInput === "otp" && styles.inputFocused, touched.otp && errors.otp && styles.inputError]}>
                    <Icon name="key" size={20} color={focusedInput === "otp" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      value={values.otp}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, "");
                        handleChange("otp")(cleaned);
                      }}
                      onFocus={() => handleInputFocus("otp")}
                      onBlur={() => {
                        handleInputBlur();
                        handleBlur("otp");
                      }}
                      placeholder="Enter 6-digit OTP"
                      keyboardType="numeric"
                      maxLength={6}
                    />
                  </View>
                  {touched.otp && errors.otp && (
                    <Text style={styles.errorText}>
                      <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.otp}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedInput === "newPassword" && styles.inputFocused,
                      touched.newPassword && errors.newPassword && styles.inputError,
                    ]}
                  >
                    <Icon name="lock" size={20} color={focusedInput === "newPassword" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={values.newPassword}
                      onChangeText={handleChange("newPassword")}
                      onFocus={() => handleInputFocus("newPassword")}
                      onBlur={() => {
                        handleInputBlur();
                        handleBlur("newPassword");
                      }}
                      placeholder="Enter new password"
                      secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNewPassword(!showNewPassword)}>
                      <Icon name={showNewPassword ? "eye" : "eye-off"} size={20} color={focusedInput === "newPassword" ? "#5B37B7" : "#666666"} />
                    </TouchableOpacity>
                  </View>
                  {touched.newPassword && errors.newPassword && (
                    <Text style={styles.errorText}>
                      <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.newPassword}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      focusedInput === "confirmPassword" && styles.inputFocused,
                      touched.confirmPassword && errors.confirmPassword && styles.inputError,
                    ]}
                  >
                    <Icon name="lock" size={20} color={focusedInput === "confirmPassword" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onFocus={() => handleInputFocus("confirmPassword")}
                      onBlur={() => {
                        handleInputBlur();
                        handleBlur("confirmPassword");
                      }}
                      placeholder="Confirm new password"
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Icon name={showConfirmPassword ? "eye" : "eye-off"} size={20} color={focusedInput === "confirmPassword" ? "#5B37B7" : "#666666"} />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.confirmPassword}
                    </Text>
                  )}
                </View>

                <View style={styles.resendContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      // Resend OTP by calling forgotPassword again
                      dispatch(
                        forgotPassword({
                          contactType: contactInfo.type,
                          contact: contactInfo.value,
                          company_id: contactInfo.company_id,
                        })
                      );
                    }}
                    style={styles.resendButton}
                  >
                    <Text style={styles.resendText}>Didn't receive code? Send again</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.resetButton, (errors.otp || errors.newPassword || errors.confirmPassword || isSubmitting) && styles.authButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={Boolean(errors.otp || errors.newPassword || errors.confirmPassword || isSubmitting)}
                >
                  {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.resetButtonText}>Reset Password</Text>}
                </TouchableOpacity>
              </>
            )}
          </Formik>
        );
    }
  };

  const renderSignupOTPModal = () => (
    <Modal animationType="slide" transparent={true} visible={showSignupOTP} onRequestClose={() => setShowSignupOTP(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Verify Account</Text>
            <TouchableOpacity onPress={() => setShowSignupOTP(false)}>
              <Icon name="x" size={24} color="#333333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>Enter the 6-digit code sent to your phone number</Text>

          <Formik initialValues={{ otp: "" }} validationSchema={OTPSchema} onSubmit={handleSignupOTPVerification}>
            {({ handleSubmit, values, setFieldValue, errors, touched, handleBlur, isSubmitting }) => (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>OTP Code</Text>
                  <View style={[styles.inputWrapper, focusedInput === "signupOtp" && styles.inputFocused, touched.otp && errors.otp && styles.inputError]}>
                    <Icon name="key" size={20} color={focusedInput === "signupOtp" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      value={values.otp}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, "");
                        setFieldValue("otp", cleaned);
                      }}
                      onFocus={() => handleInputFocus("signupOtp")}
                      onBlur={() => {
                        handleInputBlur();
                        handleBlur("otp");
                      }}
                      placeholder="Enter 6-digit OTP"
                      keyboardType="numeric"
                      maxLength={6}
                      placeholderTextColor="#999999"
                    />
                  </View>
                  {touched.otp && errors.otp && (
                    <Text style={styles.errorText}>
                      <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.otp}
                    </Text>
                  )}
                </View>

                <View style={styles.resendContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      // Resend OTP by calling signup again
                      dispatch(
                        signup({
                          name: signupData.name,
                          email: signupData.email,
                          phone: signupData.phone,
                          password: signupData.password,
                          company_id: signupData.company_id,
                        })
                      );
                    }}
                    style={styles.resendButton}
                  >
                    <Text style={styles.resendText}>Didn't receive code? Send again</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.resetButton, (!values.otp || values.otp.length < 6 || isSubmitting) && styles.authButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={!values.otp || values.otp.length < 6 || isSubmitting}
                >
                  {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.resetButtonText}>Verify OTP</Text>}
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );

  const handleVerificationComplete = async (values, { setSubmitting }) => {
    try {
      if (values.otp && values.otp.length === 6) {
        const response = await dispatch(
          verifyOTP({
            user_id: signupOtpVerified.user_id,
            otp: values.otp,
            company_id: signupOtpVerified.company_id,
          })
        ).unwrap();
        setShowVerificationModal(false);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.message || "OTP Verified!",
          position: "bottom",
        });
      } else {
        Alert.alert("Error", "Please enter a valid 6-digit OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderVerificationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showVerificationModal}
      onRequestClose={() => {
        setShowVerificationModal(false);
        setPendingLoginData(null);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Verify Account</Text>
            <TouchableOpacity
              onPress={() => {
                setShowVerificationModal(false);
                setPendingLoginData(null);
              }}
            >
              <Icon name="x" size={24} color="#333333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Your account needs verification. Please enter the OTP sent to your phone number:
            <Text style={{ fontWeight: "bold" }}> {pendingLoginData?.phoneNumber}</Text>
          </Text>

          <Formik initialValues={{ otp: "" }} validationSchema={OTPSchema} onSubmit={handleVerificationComplete}>
            {({ handleSubmit, values, setFieldValue, errors, touched, handleBlur, isSubmitting }) => (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>OTP Code</Text>
                  <View style={[styles.inputWrapper, focusedInput === "loginOtp" && styles.inputFocused, touched.otp && errors.otp && styles.inputError]}>
                    <Icon name="key" size={20} color={focusedInput === "loginOtp" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      value={values.otp}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, "");
                        setFieldValue("otp", cleaned);
                      }}
                      onFocus={() => handleInputFocus("loginOtp")}
                      onBlur={() => {
                        handleInputBlur();
                        handleBlur("otp");
                      }}
                      placeholder="Enter 6-digit OTP"
                      keyboardType="numeric"
                      maxLength={6}
                      placeholderTextColor="#999999"
                    />
                  </View>
                  {touched.otp && errors.otp && (
                    <Text style={styles.errorText}>
                      <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.otp}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.resetButton, (!values.otp || values.otp.length < 6 || isSubmitting) && styles.authButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={!values.otp || values.otp.length < 6 || isSubmitting}
                >
                  {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.resetButtonText}>Verify & Login</Text>}
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#5B37B7" />

      {/* Background Gradient */}
      <LinearGradient colors={["#7B5AC5", "#5B37B7", "#4A2D96"]} style={styles.gradientBackground} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>Q</Text>
          </View>
          <Text style={styles.appName}>QuickShop</Text>
        </View>

        {/* Auth Card */}
        <View style={styles.authCard}>
          {/* Auth Title */}
          <Text style={styles.titleText}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
          <Text style={styles.subtitle}>{isLogin ? "Sign in to continue shopping" : "Sign up for a seamless shopping experience"}</Text>

          {/* Auth Forms Container */}
          <Animated.View style={[styles.formsContainer, { transform: [{ translateX: slideAnim }] }]}>
            {/* Login Form */}
            <View style={[styles.formContainer, { width }]}>
              <Formik initialValues={{ phoneNumber: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleLogin}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Phone Number</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === "loginPhone" && styles.inputFocused,
                          touched.phoneNumber && errors.phoneNumber && styles.inputError,
                          values.phoneNumber && !errors.phoneNumber && styles.inputSuccess,
                        ]}
                      >
                        <Icon name="smartphone" size={20} color={focusedInput === "loginPhone" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={values.phoneNumber}
                          onChangeText={(text) => formatPhoneNumber(text, setFieldValue)}
                          onFocus={() => handleInputFocus("loginPhone")}
                          onBlur={() => {
                            handleInputBlur();
                            handleBlur("phoneNumber");
                          }}
                          placeholder="Enter your phone number"
                          keyboardType="phone-pad"
                          maxLength={10}
                          placeholderTextColor="#999999"
                        />
                        {values.phoneNumber && !errors.phoneNumber && <Icon name="check-circle" size={20} color="#4CAF50" style={styles.validIcon} />}
                      </View>
                      {touched.phoneNumber && errors.phoneNumber && (
                        <Text style={styles.errorText}>
                          <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.phoneNumber}
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === "loginPassword" && styles.inputFocused,
                          touched.password && errors.password && styles.inputError,
                          values.password && !errors.password && styles.inputSuccess,
                        ]}
                      >
                        <Icon name="lock" size={20} color={focusedInput === "loginPassword" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={values.password}
                          onChangeText={handleChange("password")}
                          onFocus={() => handleInputFocus("loginPassword")}
                          onBlur={() => {
                            handleInputBlur();
                            handleBlur("password");
                          }}
                          placeholder="Enter your password"
                          secureTextEntry={secureLoginPassword}
                          placeholderTextColor="#999999"
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setSecureLoginPassword(!secureLoginPassword)}>
                          <Icon name={secureLoginPassword ? "eye-off" : "eye"} size={20} color={focusedInput === "loginPassword" ? "#5B37B7" : "#666666"} />
                        </TouchableOpacity>
                      </View>
                      {touched.password && errors.password && (
                        <Text style={styles.errorText}>
                          <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.password}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity style={styles.forgotPassword} onPress={() => setForgotPasswordVisible(true)}>
                      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.authButton,
                        (Object.keys(errors).length > 0 || values.phoneNumber === "" || values.password === "" || isSubmitting) && styles.authButtonDisabled,
                      ]}
                      onPress={handleSubmit}
                      disabled={Object.keys(errors).length > 0 || values.phoneNumber === "" || values.password === "" || isSubmitting}
                    >
                      <LinearGradient colors={["#7B5AC5", "#5B37B7", "#4A2D96"]} style={styles.buttonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        {isSubmitting ? (
                          <ActivityIndicator color="#ffffff" />
                        ) : (
                          <View style={styles.buttonContent}>
                            <Text style={styles.authButtonText}>Sign In</Text>
                            <Icon name="arrow-right" size={20} color="#ffffff" />
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </View>

            {/* Signup Form */}
            <View style={[styles.formContainer, { width }]}>
              <Formik initialValues={{ name: "", email: "", phoneNumber: "", password: "" }} validationSchema={SignupSchema} onSubmit={handleSignup}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === "signupName" && styles.inputFocused,
                          touched.name && errors.name && styles.inputError,
                          values.name && !errors.name && styles.inputSuccess,
                        ]}
                      >
                        <Icon name="user" size={20} color={focusedInput === "signupName" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={values.name}
                          onChangeText={handleChange("name")}
                          onFocus={() => handleInputFocus("signupName")}
                          onBlur={() => {
                            handleInputBlur();
                            handleBlur("name");
                          }}
                          placeholder="Enter your full name"
                          placeholderTextColor="#999999"
                        />
                        {values.name && !errors.name && <Icon name="check-circle" size={20} color="#4CAF50" style={styles.validIcon} />}
                      </View>
                      {touched.name && errors.name && (
                        <Text style={styles.errorText}>
                          <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.name}
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === "signupEmail" && styles.inputFocused,
                          touched.email && errors.email && styles.inputError,
                          values.email && !errors.email && styles.inputSuccess,
                        ]}
                      >
                        <Icon name="mail" size={20} color={focusedInput === "signupEmail" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={values.email}
                          onChangeText={handleChange("email")}
                          onFocus={() => handleInputFocus("signupEmail")}
                          onBlur={() => {
                            handleInputBlur();
                            handleBlur("email");
                          }}
                          placeholder="Enter your email address"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          placeholderTextColor="#999999"
                        />
                        {values.email && !errors.email && <Icon name="check-circle" size={20} color="#4CAF50" style={styles.validIcon} />}
                      </View>
                      {touched.email && errors.email && (
                        <Text style={styles.errorText}>
                          <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.email}
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Phone Number</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === "signupPhone" && styles.inputFocused,
                          touched.phoneNumber && errors.phoneNumber && styles.inputError,
                          values.phoneNumber && !errors.phoneNumber && styles.inputSuccess,
                        ]}
                      >
                        <Icon name="smartphone" size={20} color={focusedInput === "signupPhone" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={values.phoneNumber}
                          onChangeText={(text) => formatPhoneNumber(text, setFieldValue)}
                          onFocus={() => handleInputFocus("signupPhone")}
                          onBlur={() => {
                            handleInputBlur();
                            handleBlur("phoneNumber");
                          }}
                          placeholder="Enter your phone number"
                          keyboardType="phone-pad"
                          maxLength={10}
                          placeholderTextColor="#999999"
                        />
                        {values.phoneNumber && !errors.phoneNumber && <Icon name="check-circle" size={20} color="#4CAF50" style={styles.validIcon} />}
                      </View>
                      {touched.phoneNumber && errors.phoneNumber && (
                        <Text style={styles.errorText}>
                          <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.phoneNumber}
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <View
                        style={[
                          styles.inputWrapper,
                          focusedInput === "signupPassword" && styles.inputFocused,
                          touched.password && errors.password && styles.inputError,
                          values.password && !errors.password && styles.inputSuccess,
                        ]}
                      >
                        <Icon name="lock" size={20} color={focusedInput === "signupPassword" ? "#5B37B7" : "#666666"} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          value={values.password}
                          onChangeText={handleChange("password")}
                          onFocus={() => handleInputFocus("signupPassword")}
                          onBlur={() => {
                            handleInputBlur();
                            handleBlur("password");
                          }}
                          placeholder="Create a password"
                          secureTextEntry={secureSignupPassword}
                          placeholderTextColor="#999999"
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setSecureSignupPassword(!secureSignupPassword)}>
                          <Icon name={secureSignupPassword ? "eye-off" : "eye"} size={20} color={focusedInput === "signupPassword" ? "#5B37B7" : "#666666"} />
                        </TouchableOpacity>
                      </View>
                      {touched.password && errors.password && (
                        <Text style={styles.errorText}>
                          <Icon name="alert-circle" size={14} color="#FF3B30" /> {errors.password}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.authButton,
                        (Object.keys(errors).length > 0 ||
                          values.name === "" ||
                          values.email === "" ||
                          values.phoneNumber === "" ||
                          values.password === "" ||
                          isSubmitting) &&
                          styles.authButtonDisabled,
                      ]}
                      onPress={handleSubmit}
                      disabled={
                        Object.keys(errors).length > 0 ||
                        values.name === "" ||
                        values.email === "" ||
                        values.phoneNumber === "" ||
                        values.password === "" ||
                        isSubmitting
                      }
                    >
                      <LinearGradient colors={["#7B5AC5", "#5B37B7", "#4A2D96"]} style={styles.buttonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        {isSubmitting ? (
                          <ActivityIndicator color="#ffffff" />
                        ) : (
                          <View style={styles.buttonContent}>
                            <Text style={styles.authButtonText}>Create Account</Text>
                            <Icon name="user-plus" size={20} color="#ffffff" />
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </View>
          </Animated.View>

          {/* <View style={styles.socialContainer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <View>
                  <Icon name="github" size={24} color="#333333" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <View>
                  <Icon name="facebook" size={24} color="#1877F2" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <View>
                  <Icon name="twitter" size={24} color="#1DA1F2" />
                </View>
              </TouchableOpacity>
            </View>
          </View> */}

          {/* Switch Login/Signup */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>{isLogin ? "Don't have an account? " : "Already have an account? "}</Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.switchButtonText}>{isLogin ? "Sign up" : "Sign in"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal animationType="slide" transparent={true} visible={forgotPasswordVisible} onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="x" size={24} color="#333333" />
              </TouchableOpacity>
            </View>

            {resetSuccess ? (
              <View style={styles.successContainer}>
                <Icon name="check-circle" size={60} color="#4CAF50" />
                <Text style={styles.successText}>Password reset link sent!</Text>
                <Text style={styles.successSubtext}>Check your phone for instructions.</Text>
              </View>
            ) : (
              renderForgotPasswordContent()
            )}
          </View>
        </View>
      </Modal>

      {renderSignupOTPModal()}

      {renderVerificationModal()}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5B37B7",
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  logoBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  logoText: {
    fontSize: 36,
    color: "#5B37B7",
    fontWeight: "bold",
  },
  appName: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  authCard: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingBottom: 20,
    marginTop: 20,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 30,
    paddingHorizontal: 24,
  },
  formsContainer: {
    flexDirection: "row",
    width: width * 2,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#F9F9F9",
  },
  inputIcon: {
    marginRight: 10,
  },
  inputIconFocused: {
    color: "#5B37B7",
  },
  validIcon: {
    marginLeft: 5,
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1.5,
    backgroundColor: "#FFF8F8",
  },
  inputSuccess: {
    borderColor: "#4CAF50",
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#5B37B7",
    fontSize: 14,
    fontWeight: "600",
  },
  authButton: {
    borderRadius: 12,
    height: 56,
    overflow: "hidden",
    marginBottom: 24,
  },
  buttonGradient: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  authButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "#9B9B9B",
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  socialContainer: {
    marginTop: 10,
    paddingHorizontal: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666666",
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  socialButton: {
    marginHorizontal: 12,
  },
  socialIconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  switchText: {
    color: "#666666",
    fontSize: 14,
  },
  switchButtonText: {
    color: "#5B37B7",
    fontSize: 14,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
  },
  resetButton: {
    borderRadius: 12,
    height: 56,
    backgroundColor: "#5B37B7",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 10,
  },
  successSubtext: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  segmentedControl: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: "#5B37B7",
    borderRadius: 6,
  },
  segmentText: {
    color: "#666666",
    fontWeight: "600",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  inputFocused: {
    borderColor: "#5B37B7",
    backgroundColor: "#F0EBFF",
    borderWidth: 1.5,
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    color: "#5B37B7",
    fontSize: 14,
    fontWeight: "600",
  },
  otpInput: {
    letterSpacing: 8,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#000",
  },
});

export default AuthScreen;
