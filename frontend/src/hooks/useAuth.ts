import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useRefreshTokenMutation,
  type LoginRequest,
  type RegisterRequest,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from "../store/api/authApi";
import {
  logout as logoutAction,
  setCredentials,
  clearError,
  selectCurrentUser,
  selectToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
} from "../store/slices/userSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  // API hooks
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [updateProfileMutation, { isLoading: isUpdateLoading }] = useUpdateProfileMutation();
  const [changePasswordMutation, { isLoading: isChangePasswordLoading }] = useChangePasswordMutation();
  const [deleteAccountMutation, { isLoading: isDeleteLoading }] = useDeleteAccountMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Profile query (only if authenticated)
  const { 
    data: profileData, 
    isLoading: isProfileLoading, 
    refetch: refetchProfile 
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Auth actions
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      dispatch(setCredentials({
        user: result.user,
        token: result.token,
      }));
      return result;
    } catch (error) {
      throw error;
    }
  }, [loginMutation, dispatch]);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      const result = await registerMutation(userData).unwrap();
      dispatch(setCredentials({
        user: result.user,
        token: result.token,
      }));
      return result;
    } catch (error) {
      throw error;
    }
  }, [registerMutation, dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    // Clear any cached data
    localStorage.removeItem("token");
  }, [dispatch]);

  const updateProfile = useCallback(async (profileData: UpdateProfileRequest) => {
    try {
      const result = await updateProfileMutation(profileData).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [updateProfileMutation]);

  const changePassword = useCallback(async (passwordData: ChangePasswordRequest) => {
    try {
      const result = await changePasswordMutation(passwordData).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [changePasswordMutation]);

  const deleteAccount = useCallback(async () => {
    try {
      const result = await deleteAccountMutation().unwrap();
      dispatch(logoutAction());
      return result;
    } catch (error) {
      throw error;
    }
  }, [deleteAccountMutation, dispatch]);

  const refreshToken = useCallback(async () => {
    try {
      const result = await refreshTokenMutation().unwrap();
      dispatch(setCredentials({
        user: result.user,
        token: result.token,
      }));
      return result;
    } catch (error) {
      dispatch(logoutAction());
      throw error;
    }
  }, [refreshTokenMutation, dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading || isRegisterLoading || isProfileLoading,
    error,
    
    // Loading states for specific actions
    isLoginLoading,
    isRegisterLoading,
    isUpdateLoading,
    isChangePasswordLoading,
    isDeleteLoading,
    isProfileLoading,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    refreshToken,
    clearAuthError,
    refetchProfile,

    // Profile data
    profileData,
  };
};

export default useAuth;