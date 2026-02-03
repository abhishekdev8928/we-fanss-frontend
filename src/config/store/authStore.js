import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import Cookies from "js-cookie";


const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", 
  path: "/",
};

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

/* =========================
   COOKIE HELPERS
========================= */
export const setAuthCookies = (access, refresh) => {
  Cookies.set(ACCESS_TOKEN, access, { ...COOKIE_OPTIONS, expires: 1 }); // 1 day
  Cookies.set(REFRESH_TOKEN, refresh, { ...COOKIE_OPTIONS, expires: 7 }); // 7 days
};

export const clearAuthCookies = () => {
  Cookies.remove(ACCESS_TOKEN, { path: "/" });
  Cookies.remove(REFRESH_TOKEN, { path: "/" });
};

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN);
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN);


export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        
        user: null,
        roleName: null, // ✅ Added roleName

        // Flow states
        authStatus: "guest", // "guest" | "pending-otp" | "authenticated"
        resetStatus: "idle", // "idle" | "otp-sent" | "otp-verified"

        // Email tracking for OTP flows
        loginEmail: null,
        resetEmail: null,

        // UI state
        isLoading: false,
        error: null,

        // Hydration flag to prevent flicker
        hasHydrated: false,

        // ===== HYDRATION =====
        setHasHydrated: () =>
          set({ hasHydrated: true }, false, "auth/setHasHydrated"),

        // ===== LOGIN FLOW =====

        // Step 1: Password verified → waiting for OTP
        setLoginPending: (email) =>
          set(
            {
              authStatus: "pending-otp",
              loginEmail: email,
              error: null,
              isLoading: false,
            },
            false,
            "auth/setLoginPending"
          ),

        // Step 2: OTP verified → fully authenticated
        // ✅ Updated to accept roleName
        loginSuccess: (user, roleName) =>
          set(
            {
              user,
              roleName, // ✅ Store roleName
              authStatus: "authenticated",
              loginEmail: null,
              error: null,
              isLoading: false,
            },
            false,
            "auth/loginSuccess"
          ),

        // Clear login flow (e.g., user goes back)
        clearLoginFlow: () =>
          set(
            {
              authStatus: "guest",
              loginEmail: null,
              error: null,
              isLoading: false,
            },
            false,
            "auth/clearLoginFlow"
          ),

        // ===== RESET PASSWORD FLOW =====

        // Step 1: Reset OTP sent
        setResetOtpSent: (email) =>
          set(
            {
              resetStatus: "otp-sent",
              resetEmail: email,
              error: null,
              isLoading: false,
            },
            false,
            "auth/setResetOtpSent"
          ),

        // Step 2: Reset OTP verified
        setResetOtpVerified: () =>
          set(
            {
              resetStatus: "otp-verified",
              error: null,
              isLoading: false,
            },
            false,
            "auth/setResetOtpVerified"
          ),

        // Step 3: Password reset complete
        resetPasswordComplete: () =>
          set(
            {
              resetStatus: "idle",
              resetEmail: null,
              error: null,
              isLoading: false,
            },
            false,
            "auth/resetPasswordComplete"
          ),

        // Clear reset flow (user navigates away)
        clearResetFlow: () =>
          set(
            {
              resetStatus: "idle",
              resetEmail: null,
              error: null,
              isLoading: false,
            },
            false,
            "auth/clearResetFlow"
          ),

        // ===== UI STATE =====

        setLoading: (isLoading) =>
          set({ isLoading }, false, "auth/setLoading"),

        // ✅ Normalized error handling
        setError: (error) =>
          set(
            {
              error: error?.message || error || "Something went wrong",
              isLoading: false,
            },
            false,
            "auth/setError"
          ),

        clearError: () => set({ error: null }, false, "auth/clearError"),

        // ===== LOGOUT =====
        logout: () => {
          const currentState = get();
          
          // Skip if already logged out
          if (currentState.authStatus === "guest" && !currentState.user) {
            return;
          }

          clearAuthCookies();
          
          // ✅ Clear persisted storage completely
          useAuthStore.persist.clearStorage();

          set(
            {
              user: null,
              roleName: null, // ✅ Clear roleName
              authStatus: "guest",
              resetStatus: "idle",
              loginEmail: null,
              resetEmail: null,
              error: null,
              isLoading: false,
            },
            false,
            "auth/logout"
          );
        },

        // ===== UPDATE USER =====
        // ✅ Updated to optionally accept roleName
        setUser: (user, roleName) => 
          set(
            { 
              user,
              ...(roleName !== undefined && { roleName }) // Only update if provided
            }, 
            false, 
            "auth/setUser"
          ),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          roleName: state.roleName, // ✅ Persist roleName
          // Flow states are NOT persisted (session-only)
        }),
        // ✅ Set hydration flag on rehydrate
        onRehydrateStorage: () => () => {
          useAuthStore.getState().setHasHydrated();
        },
      }
    ),
    { name: "AuthStore", enabled: process.env.NODE_ENV === "development" }
  )
);

/* =========================
   SELECTORS
========================= */
export const useAuthUser = () => useAuthStore((s) => s.user);
export const useRoleName = () => useAuthStore((s) => s.roleName); 

// ✅ isAuthenticated reads ONLY from cookie, NOT store
export const useIsAuthenticated = () => Boolean(getAccessToken());

// Hydration state
export const useHasHydrated = () => useAuthStore((s) => s.hasHydrated);

// Auth Flow
export const useAuthStatus = () => useAuthStore((s) => s.authStatus);
export const useLoginEmail = () => useAuthStore((s) => s.loginEmail);

// Reset Flow
export const useResetStatus = () => useAuthStore((s) => s.resetStatus);
export const useResetEmail = () => useAuthStore((s) => s.resetEmail);




// UI State
export const useAuthLoading = () => useAuthStore((s) => s.isLoading);
export const useAuthError = () => useAuthStore((s) => s.error);