import httpClient from "../config/http/httpClient";
import {
  useAuthStore,
  setAuthCookies,
  clearAuthCookies,
  getAccessToken,
} from "../config/store/authStore";

/* =========================
   HELPER: EXTRACT ERROR MESSAGE
========================= */
const extractErrorMessage = (error, defaultMessage) => {
  return error.response?.data?.message || defaultMessage;
};

/* =========================
   REGISTRATION
========================= */
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (userData) => {
  try {
    const { data } = await httpClient.post("/auth/register", userData);
    return data;
  } catch (error) {
    throw extractErrorMessage(error, "Registration failed");
  }
};

/* =========================
   LOGIN FLOW (2-STEP)
========================= */
/**
 * @route   POST /api/auth/login
 * @desc    Step 1: Login with email + password, sends OTP to email
 * @access  Public
 */
export const login = async (email, password) => {
  try {
    const { data } = await httpClient.post("/auth/login", { email, password });

    // Update store: mark as pending OTP
    useAuthStore.getState().setLoginPending(email);

    return data;
  } catch (error) {
    throw extractErrorMessage(error, "Login failed. Please try again.");
  }
};

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Step 2: Verify Email OTP or Google Authenticator
 * @access  Public
 */
export const verifyOtp = async (email, otp) => {
  try {
    const { data } = await httpClient.post("/auth/verify-otp", { email, otp });

    // Store tokens in cookies
    setAuthCookies(data.accessToken, data.refreshToken);

    // ✅ Update store: login successful WITH roleName
    useAuthStore.getState().loginSuccess(data.user, data.user.roleName);

    return data;
  } catch (error) {
    throw extractErrorMessage(error, "Invalid OTP. Please try again.");
  }
};

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP for login verification
 * @access  Public
 */
export const resendOtp = async (email) => {
  try {
    const { data } = await httpClient.post("/auth/resend-otp", { email });
    return data;
  } catch (error) {
    throw extractErrorMessage(error, "Failed to resend OTP. Please try again.");
  }
};

/* =========================
   PASSWORD RESET FLOW (3-STEP)
========================= */
/**
 * @route   POST /api/auth/forgot-password
 * @desc    Step 1: Send OTP for password reset
 * @access  Public
 */
export const forgotPassword = async (email) => {
  try {
    const { data } = await httpClient.post("/auth/forgot-password", { email });

    // Update store: reset OTP sent
    useAuthStore.getState().setResetOtpSent(email);

    return data;
  } catch (error) {
    throw extractErrorMessage(
      error,
      "Failed to send reset code. Please try again."
    );
  }
};

/**
 * @route   POST /api/auth/verify-reset-otp
 * @desc    Step 2: Verify reset OTP (no password change yet)
 * @access  Public
 */
export const verifyResetOtp = async (email, otp) => {
  try {
    const { data } = await httpClient.post("/auth/verify-reset-otp", {
      email,
      otp,
    });

    // Update store: OTP verified
    useAuthStore.getState().setResetOtpVerified();

    return data;
  } catch (error) {
    throw extractErrorMessage(error, "Invalid reset code. Please try again.");
  }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Step 3: Set new password after OTP verification
 * @access  Public
 */
export const resetPassword = async (email, newPassword) => {
  try {
    const { data } = await httpClient.post("/auth/reset-password", {
      email,
      newPassword,
    });

    // Update store: reset complete
    useAuthStore.getState().resetPasswordComplete();

    return data;
  } catch (error) {
    throw extractErrorMessage(
      error,
      "Failed to reset password. Please try again."
    );
  }
};

/* =========================
   TOKEN MANAGEMENT
========================= */
/**
 * @route   POST /api/auth/refresh-token
 * @desc    Get new access token using refresh token
 * @access  Public
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    const { data } = await httpClient.post("/auth/refresh-token", {
      refreshToken,
    });

    // Update cookies with new access token
    setAuthCookies(data.accessToken, refreshToken);

    return data;
  } catch (error) {
    // If refresh fails, logout user
    clearAuthCookies();
    useAuthStore.getState().logout();
    throw extractErrorMessage(error, "Session expired. Please login again.");
  }
};

/* =========================
   USER PROFILE
========================= */
/**
 * @route   GET /api/auth/profile
 * @desc    Get current authenticated user profile
 * @access  Private
 */
export const getProfile = async () => {
  try {
    const { data } = await httpClient.get("/auth/profile");

    // ✅ Update user in store WITH roleName
    useAuthStore.getState().setUser(data.user, data.user.roleName);

    return data;
  } catch (error) {
    throw extractErrorMessage(
      error,
      "Failed to fetch profile. Please try again."
    );
  }
};

/* =========================
   LOGOUT
========================= */
/**
 * @route   POST /api/auth/logout
 * @desc    Logout user from current session
 * @access  Private
 */
export const logout = async () => {
  try {
    await httpClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue with logout even if API fails
  } finally {
    // Always clear local state
    useAuthStore.getState().logout();
  }
};

/* =========================
   HELPER: Check if user is authenticated
========================= */
export const isAuthenticated = () => {
  // ✅ Check cookie directly, not store
  return Boolean(getAccessToken());
};

/* =========================
   HELPER: Get current user
========================= */
export const getCurrentUser = () => {
  return useAuthStore.getState().user;
};

/**
 * @desc    
 */
export const initializeAuth = async () => {
  try {
    // Check if we have tokens
    if (!isAuthenticated()) {
      return null;
    }

    // Fetch user profile
    const profile = await getProfile();
    return profile.user;
  } catch (error) {
    console.error("Failed to initialize auth:", error);
    // Clear auth state on error
    useAuthStore.getState().logout();
    return null;
  }
};