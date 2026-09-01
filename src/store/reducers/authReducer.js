import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwt from "jwt-decode";
import axios from "axios";
import api from "../../api/api";
import { api_url } from "../../utils/config";

const accessTokenKey = "customerToken";
const refreshTokenKey = "customerRefreshToken";
const pendingEmailKey = "pendingVerificationEmail";

const getStoredAccessToken = () => localStorage.getItem(accessTokenKey) || "";
const getStoredRefreshToken = () => localStorage.getItem(refreshTokenKey) || "";
const getStoredPendingEmail = () => localStorage.getItem(pendingEmailKey) || "";

const isTokenExpired = (token) => {
  try {
    const payload = jwt(token);
    if (!payload?.exp) return false;
    return payload.exp * 1000 <= Date.now();
  } catch (error) {
    return true;
  }
};

const persistTokens = ({ accessToken = "", refreshToken = "" }) => {
  if (accessToken) {
    localStorage.setItem(accessTokenKey, accessToken);
  } else {
    localStorage.removeItem(accessTokenKey);
  }

  if (refreshToken) {
    localStorage.setItem(refreshTokenKey, refreshToken);
  } else {
    localStorage.removeItem(refreshTokenKey);
  }
};

const clearStoredAuth = () => {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
};

const decodeToken = (token) => {
  if (!token) return "";
  try {
    if (isTokenExpired(token)) {
      localStorage.removeItem(accessTokenKey);
      return "";
    }
    return jwt(token);
  } catch (error) {
    localStorage.removeItem(accessTokenKey);
    return "";
  }
};

const getErrorMessage = (payload, fallback) =>
  payload?.message || payload?.error || fallback;

export const initialize_auth = createAsyncThunk(
  "auth/initialize_auth",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    const accessToken = getStoredAccessToken();
    const refreshToken = getStoredRefreshToken();

    if (accessToken && !isTokenExpired(accessToken)) {
      return fulfillWithValue({
        accessToken,
        refreshToken,
        userInfo: decodeToken(accessToken),
      });
    }

    if (!refreshToken) {
      return fulfillWithValue({
        accessToken: "",
        refreshToken: "",
        userInfo: "",
      });
    }

    try {
      const { data } = await axios.post(`${api_url}/api/auth/refresh-token`, {
        refreshToken,
      });

      persistTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken,
      });

      return fulfillWithValue({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken,
        userInfo: decodeToken(data.accessToken),
      });
    } catch (error) {
      clearStoredAuth();
      return rejectWithValue(
        error.response?.data || { message: "Session expired. Please login again." },
      );
    }
  },
);

export const customer_register = createAsyncThunk(
  "auth/customer_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const payload = {
        name: info.name,
        email: info.email,
        phone: info.phone,
        password: info.password,
      };
      const { data } = await api.post("/customer/customer-register", payload);
      if (data?.success === false) {
        return rejectWithValue(data);
      }
      if (data?.requiresOtp) {
        return fulfillWithValue(data);
      }
      localStorage.setItem(pendingEmailKey, info.email);
      return fulfillWithValue({
        ...data,
        email: info.email,
      });
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to create account" });
    }
  },
);

export const verify_signup_otp = createAsyncThunk(
  "auth/verify_signup_otp",
  async ({ otp }, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const { signupOtpChallengeToken } = getState().auth;
      const { data } = await api.post("/auth/signup-otp/verify", {
        challengeToken: signupOtpChallengeToken,
        otp,
        role: "customer",
      });
      if (data?.success === false) {
        return rejectWithValue(data);
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to verify signup OTP" });
    }
  },
);

export const retry_signup_otp = createAsyncThunk(
  "auth/retry_signup_otp",
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const { signupOtpChallengeToken } = getState().auth;
      const { data } = await api.post("/auth/signup-otp/retry", {
        challengeToken: signupOtpChallengeToken,
        role: "customer",
      });
      if (data?.success === false) {
        return rejectWithValue(data);
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to resend OTP" });
    }
  },
);

export const customer_login = createAsyncThunk(
  "auth/customer_login",
    async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/customer/customer-login", info);
      if (data?.success === false) {
        return rejectWithValue({
          ...data,
          email: info.email,
        });
      }
      if (data?.requiresOtp) {
        return fulfillWithValue(data);
      }
      persistTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      localStorage.removeItem(pendingEmailKey);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to login" });
    }
  },
);

export const verify_login_otp = createAsyncThunk(
  "auth/verify_login_otp",
  async ({ otp }, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const { otpChallengeToken } = getState().auth;
      const { data } = await api.post("/auth/login-otp/verify", {
        challengeToken: otpChallengeToken,
        otp,
        role: "customer",
      });
      if (data?.success === false) {
        return rejectWithValue(data);
      }
      persistTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      localStorage.removeItem(pendingEmailKey);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to verify OTP" });
    }
  },
);

export const retry_login_otp = createAsyncThunk(
  "auth/retry_login_otp",
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const { otpChallengeToken } = getState().auth;
      const { data } = await api.post("/auth/login-otp/retry", {
        challengeToken: otpChallengeToken,
        role: "customer",
      });
      if (data?.success === false) {
        return rejectWithValue(data);
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to resend OTP" });
    }
  },
);

export const resend_verification = createAsyncThunk(
  "auth/resend_verification",
  async ({ email }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/auth/resend-verification", { email });
      if (data?.success === false) {
        return rejectWithValue(data);
      }
      localStorage.setItem(pendingEmailKey, email);
      return fulfillWithValue({
        ...data,
        email,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unable to resend verification email" },
      );
    }
  },
);

export const verify_email = createAsyncThunk(
  "auth/verify_email",
  async ({ token }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
      if (data?.success === false) {
        return rejectWithValue(data);
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "This verification link is invalid or expired." },
      );
    }
  },
);

export const forgot_password = createAsyncThunk(
  "auth/forgot_password",
    async ({ email }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      if (data?.success === false) {
        return rejectWithValue(data);
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unable to send reset link" },
      );
    }
  },
);

export const reset_password = createAsyncThunk(
  "auth/reset_password",
    async ({ token, password }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/auth/reset-password", { token, password });
      if (data?.success === false) {
        return rejectWithValue(data);
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unable to reset password" },
      );
    }
  },
);

export const customer_logout = createAsyncThunk(
  "auth/customer_logout",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      await api.post("/auth/logout", {
        refreshToken: getStoredRefreshToken(),
      });
      clearStoredAuth();
      return fulfillWithValue({ message: "Logged out successfully" });
    } catch (error) {
      clearStoredAuth();
      return rejectWithValue(error.response?.data || { message: "Logged out" });
    }
  },
);

export const change_password = createAsyncThunk(
  "auth/change_password",
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const { data } = await api.put(
        "/user/change-password",
        info,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      clearStoredAuth();
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unable to change password" },
      );
    }
  },
);

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    token: isTokenExpired(getStoredAccessToken()) ? "" : getStoredAccessToken(),
    refreshToken: getStoredRefreshToken(),
    userInfo: decodeToken(getStoredAccessToken()),
    errorMessage: "",
    successMessage: "",
    pendingEmail: getStoredPendingEmail(),
    verificationRequired: false,
    otpRequired: false,
    otpChallengeToken: "",
    otpMaskedIdentifier: "",
    otpExpiresInSeconds: 0,
    otpResendCooldownSeconds: 0,
    signupOtpRequired: false,
    signupOtpChallengeToken: "",
    signupOtpMaskedIdentifier: "",
    signupOtpResendCooldownSeconds: 0,
    emailVerificationStatus: "idle",
    emailVerificationMessage: "",
    authInitialized: false,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state, _) => {
      clearStoredAuth();
      state.userInfo = "";
      state.token = "";
      state.refreshToken = "";
      state.pendingEmail = "";
      state.verificationRequired = false;
      state.otpRequired = false;
      state.otpChallengeToken = "";
      state.otpMaskedIdentifier = "";
      state.otpExpiresInSeconds = 0;
      state.otpResendCooldownSeconds = 0;
      state.signupOtpRequired = false;
      state.signupOtpChallengeToken = "";
      state.signupOtpMaskedIdentifier = "";
      state.signupOtpResendCooldownSeconds = 0;
    },
    clearOtpChallenge: (state, _) => {
      state.otpRequired = false;
      state.otpChallengeToken = "";
      state.otpMaskedIdentifier = "";
      state.otpExpiresInSeconds = 0;
      state.otpResendCooldownSeconds = 0;
    },
    clearSignupOtpChallenge: (state, _) => {
      state.signupOtpRequired = false;
      state.signupOtpChallengeToken = "";
      state.signupOtpMaskedIdentifier = "";
      state.signupOtpResendCooldownSeconds = 0;
    },
    setPendingEmail: (state, { payload }) => {
      state.pendingEmail = payload || "";
      if (payload) {
        localStorage.setItem(pendingEmailKey, payload);
      } else {
        localStorage.removeItem(pendingEmailKey);
      }
    },
    updateAccessToken: (state, { payload }) => {
      state.token = payload;
      state.userInfo = decodeToken(payload);
    },
    resetVerificationState: (state, _) => {
      state.emailVerificationStatus = "idle";
      state.emailVerificationMessage = "";
    },
  },
  extraReducers: {
    [initialize_auth.pending]: (state, _) => {
      state.loader = true;
    },
    [initialize_auth.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.authInitialized = true;
      state.token = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.userInfo = payload.userInfo;
    },
    [initialize_auth.rejected]: (state, { payload }) => {
      state.loader = false;
      state.authInitialized = true;
      state.token = "";
      state.refreshToken = "";
      state.userInfo = "";
      state.errorMessage = getErrorMessage(payload, "");
    },
    [customer_register.pending]: (state, _) => {
      state.loader = true;
      state.verificationRequired = false;
    },
    [customer_register.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to create account");
    },
    [customer_register.fulfilled]: (state, { payload }) => {
      state.loader = false;
      if (payload.requiresOtp) {
        state.successMessage = payload.message || "OTP sent successfully";
        state.signupOtpRequired = true;
        state.signupOtpChallengeToken = payload.challengeToken || "";
        state.signupOtpMaskedIdentifier = payload.maskedIdentifier || "";
        state.signupOtpResendCooldownSeconds = payload.resendCooldownSeconds || 0;
        return;
      }
      state.successMessage =
        payload.message ||
        "Account created successfully. Please login to verify with OTP.";
      state.pendingEmail = payload.email || "";
      state.verificationRequired = false;
      state.token = "";
      state.refreshToken = "";
      state.userInfo = "";
    },
    [verify_signup_otp.pending]: (state, _) => {
      state.loader = true;
    },
    [verify_signup_otp.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to verify signup OTP");
    },
    [verify_signup_otp.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message || "Signup verified successfully. Please login.";
      state.signupOtpRequired = false;
      state.signupOtpChallengeToken = "";
      state.signupOtpMaskedIdentifier = "";
      state.signupOtpResendCooldownSeconds = 0;
    },
    [retry_signup_otp.pending]: (state, _) => {
      state.loader = true;
    },
    [retry_signup_otp.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to resend OTP");
    },
    [retry_signup_otp.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message || "OTP resent successfully";
      state.signupOtpMaskedIdentifier =
        payload.maskedIdentifier || state.signupOtpMaskedIdentifier;
      state.signupOtpResendCooldownSeconds =
        payload.resendCooldownSeconds || state.signupOtpResendCooldownSeconds;
    },
    [customer_login.pending]: (state, _) => {
      state.loader = true;
      state.verificationRequired = false;
    },
    [customer_login.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to login");
      state.verificationRequired =
        getErrorMessage(payload, "").toLowerCase() ===
        "please verify your email before logging in";
      if (state.verificationRequired) {
        state.pendingEmail = payload?.email || state.pendingEmail;
      }
    },
    [customer_login.fulfilled]: (state, { payload }) => {
      state.loader = false;
      if (payload.requiresOtp) {
        state.successMessage = payload.message || "OTP sent successfully";
        state.otpRequired = true;
        state.otpChallengeToken = payload.challengeToken || "";
        state.otpMaskedIdentifier = payload.maskedIdentifier || "";
        state.otpExpiresInSeconds = payload.expiresInSeconds || 0;
        state.otpResendCooldownSeconds = payload.resendCooldownSeconds || 0;
        state.token = "";
        state.refreshToken = "";
        state.userInfo = "";
        return;
      }
      state.successMessage = payload.message || "Login successful";
      state.token = payload.accessToken;
      state.refreshToken = payload.refreshToken || "";
      state.userInfo = decodeToken(payload.accessToken);
      state.verificationRequired = false;
      state.pendingEmail = "";
      state.otpRequired = false;
      state.otpChallengeToken = "";
      state.otpMaskedIdentifier = "";
      state.otpExpiresInSeconds = 0;
      state.otpResendCooldownSeconds = 0;
    },
    [verify_login_otp.pending]: (state, _) => {
      state.loader = true;
    },
    [verify_login_otp.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to verify OTP");
    },
    [verify_login_otp.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message || "Login successful";
      state.token = payload.accessToken;
      state.refreshToken = payload.refreshToken || "";
      state.userInfo = decodeToken(payload.accessToken);
      state.verificationRequired = false;
      state.pendingEmail = "";
      state.otpRequired = false;
      state.otpChallengeToken = "";
      state.otpMaskedIdentifier = "";
      state.otpExpiresInSeconds = 0;
      state.otpResendCooldownSeconds = 0;
    },
    [retry_login_otp.pending]: (state, _) => {
      state.loader = true;
    },
    [retry_login_otp.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to resend OTP");
    },
    [retry_login_otp.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message || "OTP resent successfully";
      state.otpMaskedIdentifier = payload.maskedIdentifier || state.otpMaskedIdentifier;
      state.otpResendCooldownSeconds =
        payload.resendCooldownSeconds || state.otpResendCooldownSeconds;
    },
    [resend_verification.pending]: (state, _) => {
      state.loader = true;
    },
    [resend_verification.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to resend verification email");
    },
    [resend_verification.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message || "Verification email sent successfully.";
      state.pendingEmail = payload.email || state.pendingEmail;
    },
    [verify_email.pending]: (state, _) => {
      state.loader = true;
      state.emailVerificationStatus = "loading";
      state.emailVerificationMessage = "";
    },
    [verify_email.rejected]: (state, { payload }) => {
      state.loader = false;
      state.emailVerificationStatus = "error";
      state.emailVerificationMessage =
        getErrorMessage(payload, "This verification link is invalid or expired.");
    },
    [verify_email.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.emailVerificationStatus = "success";
      state.emailVerificationMessage =
        payload.message || "Your email has been verified successfully.";
      state.verificationRequired = false;
    },
    [forgot_password.pending]: (state, _) => {
      state.loader = true;
    },
    [forgot_password.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to send reset link");
    },
    [forgot_password.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage =
        payload.message || "Password reset link sent to your email.";
    },
    [reset_password.pending]: (state, _) => {
      state.loader = true;
    },
    [reset_password.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to reset password");
    },
    [reset_password.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message || "Password updated successfully.";
    },
    [customer_logout.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message || "Logged out successfully";
      state.token = "";
      state.refreshToken = "";
      state.userInfo = "";
      state.pendingEmail = "";
      state.verificationRequired = false;
    },
    [customer_logout.rejected]: (state, { payload }) => {
      state.loader = false;
      state.token = "";
      state.refreshToken = "";
      state.userInfo = "";
      state.pendingEmail = "";
      state.verificationRequired = false;
      state.errorMessage = getErrorMessage(payload, "");
    },
    [change_password.pending]: (state, _) => {
      state.loader = true;
    },
    [change_password.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = getErrorMessage(payload, "Unable to change password");
    },
    [change_password.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message || "Password changed successfully.";
    },
  },
});

export const {
  messageClear,
  user_reset,
  setPendingEmail,
  clearOtpChallenge,
  clearSignupOtpChallenge,
  updateAccessToken,
  resetVerificationState,
} = authReducer.actions;
export default authReducer.reducer;
