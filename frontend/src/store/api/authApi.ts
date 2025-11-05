import { baseApi } from "./baseApi";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isDeleted?: number; // 1 = active, 0 = deleted
  deletedAt?: string | null;
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
  data: User;
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

export interface SendResetCodeRequest {
  email: string;
}

export interface SendResetCodeResponse {
  success: boolean;
  message: string;
  code?: string; // Only for development
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  message: string;
  canResetPassword: boolean;
}

export interface ResetPasswordWithCodeRequest {
  email: string;
  code: string;
  password: string;
}

export interface ResetPasswordWithCodeResponse {
  success: boolean;
  message: string;
  token: string;
  data: User;
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
      query: () => "/auth/me",
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
    changePassword: builder.mutation<{ success: boolean; message: string }, { currentPassword: string; newPassword: string }>({
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

    // Send reset code
    sendResetCode: builder.mutation<SendResetCodeResponse, SendResetCodeRequest>({
      query: (data) => ({
        url: "/auth/send-reset-code",
        method: "POST",
        body: data,
      }),
    }),

    // Verify reset code
    verifyResetCode: builder.mutation<VerifyResetCodeResponse, VerifyResetCodeRequest>({
      query: (data) => ({
        url: "/auth/verify-reset-code",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password with code
    resetPasswordWithCode: builder.mutation<ResetPasswordWithCodeResponse, ResetPasswordWithCodeRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Admin endpoints
    getAllUsers: builder.query<{
      success: boolean;
      data: {
        users: User[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalUsers: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      };
    }, { includeDeleted?: boolean; page?: number; limit?: number }>({
      query: (params = {}) => ({
        url: "/auth/admin/users",
        params,
      }),
      providesTags: ["User"],
    }),

    toggleUserStatus: builder.mutation<{
      success: boolean;
      message: string;
      data: { userId: string; isActive: boolean };
    }, string>({
      query: (userId) => ({
        url: `/auth/admin/users/${userId}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    restoreUser: builder.mutation<{
      success: boolean;
      message: string;
      data: { userId: string; isDeleted: number };
    }, string>({
      query: (userId) => ({
        url: `/auth/admin/users/${userId}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    permanentDeleteUser: builder.mutation<{
      success: boolean;
      message: string;
    }, string>({
      query: (userId) => ({
        url: `/auth/admin/users/${userId}/permanent-delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
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
  useSendResetCodeMutation,
  useVerifyResetCodeMutation,
  useResetPasswordWithCodeMutation,
  // Admin hooks
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
  useRestoreUserMutation,
  usePermanentDeleteUserMutation,
} = authApi;