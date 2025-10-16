const BASE_URL = import.meta.env.VITE_API_URL;

export const CLIENT_ID = {
  GOOGLE: import.meta.env.VITE_GOOGLE_CLIENT_ID,
}

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/login/`,                       // POST: Login user
    REGISTER: `${BASE_URL}/register/`,                 // POST: Register new user
    SEND_OTP: `${BASE_URL}/send-otp/`,                 // POST: Send OTP
    VERIFY_OTP: `${BASE_URL}/verify-otp/`,             // POST: Verify OTP
    RESET_PASSWORD: `${BASE_URL}/reset-password/`,     // POST: Reset user password
    GOOGLE_LOGIN: `${BASE_URL}/google_login/`,         // POST: Login via Google OAuth
  }
}