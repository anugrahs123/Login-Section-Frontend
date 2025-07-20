import axiosServices from "../utils/axios";

// Define all auth-related endpoints
export const authEndpoints = {
  login: "/auth/login",
  refresh: "/auth/refresh-token",
  logout: "/auth/logout",
  userDetails: "/auth/user",
};

// Define payload types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

// Define expected response types if needed
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Login function
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await axiosServices.post(authEndpoints.login, payload);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error?.response?.data || error.message);
    throw error;
  }
}

// Refresh token function
export async function refreshToken(
  payload: RefreshTokenPayload
): Promise<{ accessToken: string }> {
  try {
    const response = await axiosServices.post(authEndpoints.refresh, payload);
    return response.data;
  } catch (error: any) {
    console.error(
      "Token refresh error:",
      error?.response?.data || error.message
    );
    throw error;
  }
}

// Logout function
export async function logout(): Promise<void> {
  try {
    await axiosServices.post(authEndpoints.logout);
    localStorage.removeItem("serviceToken");
    localStorage.removeItem("refreshToken");
  } catch (error: any) {
    console.error("Logout error:", error?.response?.data || error.message);
    throw error;
  }
}

//user details
export async function getUserDetails() {
  try {
    const response = await axiosServices.get(authEndpoints.userDetails);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user details", error);
    throw error;
  }
}
