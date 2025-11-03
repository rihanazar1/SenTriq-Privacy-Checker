import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    // headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Base query with re-authentication logic
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Only remove token if it's actually an authentication error, not validation errors
  if (result.error && result.error.status === 401) {
    const errorData = result.error.data as any;
    
    // Don't remove token for these specific validation errors
    const validationErrors = [
      'Invalid master password',
      'master password',
      'Master password',
      'Invalid password'
    ];
    
    const isValidationError = validationErrors.some(errorText => 
      errorData?.error?.includes(errorText) || 
      errorData?.message?.includes(errorText)
    );
    
    if (isValidationError) {
      // Don't remove token for validation errors
      return result;
    }
    
    // Only remove token for actual authentication failures (expired/invalid token)
    localStorage.removeItem("token");
    (
      result.error as FetchBaseQueryError & { isAuthExpired?: boolean }
    ).isAuthExpired = true;
  }

  return result;
};



export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Auth",
    "Profile",
    "Dashboard",
    "App",
    "Comment",
    "Category",
    "Tag",
    "Settings",
    "Notification",
    "Vault",
    "EmailBreach",
    "FakeData",
  ],
  endpoints: () => ({}),
});
