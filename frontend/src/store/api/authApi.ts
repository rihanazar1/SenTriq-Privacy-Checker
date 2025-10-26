import { baseApi } from "./baseApi";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DashboardResponse {
  success: boolean;
  data: {
    totalUsers?: number;
    totalPosts?: number;
    recentActivity?: any[];
    [key: string]: any;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register user
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Login user
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Get user profile
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/auth/profile",
      providesTags: ["User", "Auth"],
    }),

    // Update profile
    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (profileData) => ({
        url: "/auth/update-profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User", "Auth"],
    }),

    // Change password
    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: passwordData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Delete account
    deleteAccount: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/delete-profile",
        method: "DELETE",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Get dashboard data
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/auth/dashboard",
      providesTags: ["User"],
    }),

    // Refresh token
    refreshToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Get profile (backward compatibility with /me endpoint)
    getMe: builder.query<ProfileResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User", "Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetDashboardQuery,
  useRefreshTokenMutation,
  useGetMeQuery,
} = authApi;