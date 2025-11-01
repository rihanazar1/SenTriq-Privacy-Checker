import { baseApi } from "./baseApi";

// Types and Interfaces
export interface AppPermissions {
  paymentInfoAccess?: boolean;
  healthDataAccess?: boolean;
  userEmail?: boolean;
  userPhoneNumber?: boolean;
  smsAccess?: boolean;
  callLogsAccess?: boolean;
  locationAccess?: boolean;
  cameraMicrophoneAccess?: boolean;
  storageAccess?: boolean;
  cookiesOrTrackers?: boolean;
  deviceIdAccess?: boolean;
  contactsAccess?: boolean;
  networkInfoAccess?: boolean;
  [key: string]: boolean | undefined;
}

export interface DomainBreaches {
  count: number;
  lastChecked: string;
}

export interface App {
  _id: string;
  userId: string;
  appName: string;
  url?: string;
  domain?: string;
  permissions: AppPermissions;
  userEmail?: string;
  userPhoneNumber?: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  domainBreaches?: DomainBreaches;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastRiskCheck?: string;
}

export interface CheckAppRiskRequest {
  appName: string;
  url?: string;
  permissions?: AppPermissions;
  userEmail?: string;
  userPhoneNumber?: string;
  save?: boolean;
}

export interface RiskBreakdown {
  baseScore: number;
  synergyPenalty: number;
  breachModifier: number;
  totalRaw: number;
  maxPossible: number;
  breachCount: number;
}

export interface CheckAppRiskResponse {
  success: boolean;
  data: {
    appName: string;
    url?: string;
    domain?: string;
    userEmail?: string;
    userPhoneNumber?: string;
    riskScore: number;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    breakdown: RiskBreakdown;
    permissions: AppPermissions;
    savedRecord?: { id: string } | null;
  };
}

export interface GetUserAppsRequest {
  page?: number;
  limit?: number;
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  sortBy?: 'createdAt' | 'riskScore' | 'appName' | 'lastRiskCheck';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetUserAppsResponse {
  success: boolean;
  data: {
    apps: App[];
    pagination: PaginationInfo;
  };
}

export interface RiskDistribution {
  _id: 'Low' | 'Medium' | 'High' | 'Critical';
  count: number;
  avgScore: number;
}

export interface HighRiskApp {
  _id: string;
  appName: string;
  riskScore: number;
  riskLevel: 'High' | 'Critical';
  domainBreaches?: DomainBreaches;
}

export interface DomainAnalysis {
  domain: string;
  appCount: number;
  avgRiskScore: number;
  totalBreaches: number;
}

export interface AppStatsSummary {
  totalApps: number;
  averageRiskScore: number;
}

export interface GetUserAppStatsResponse {
  success: boolean;
  data: {
    riskDistribution: RiskDistribution[];
    highRiskApps: HighRiskApp[];
    domainAnalysis: DomainAnalysis[];
    summary: AppStatsSummary;
  };
}

export interface UpdateAppRequest {
  appName?: string;
  url?: string;
  permissions?: AppPermissions;
  userEmail?: string;
  userPhoneNumber?: string;
}

export interface UpdateAppResponse {
  success: boolean;
  data: App;
}

export interface GetAppResponse {
  success: boolean;
  data: App;
}

export interface DeleteAppResponse {
  success: boolean;
  message: string;
}

// RTK Query API
export const appsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Check app risk
    checkAppRisk: builder.mutation<CheckAppRiskResponse, CheckAppRiskRequest>({
      query: (appData) => ({
        url: "/apps/check-risk",
        method: "POST",
        body: appData,
      }),
      invalidatesTags: ["App", "Dashboard"],
    }),

    // Get user apps with pagination and filters
    getUserApps: builder.query<GetUserAppsResponse, GetUserAppsRequest | void>({
      query: (params: GetUserAppsRequest = {}) => ({
        url: "/apps/",
        params, // always an object now
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.apps.map(({ _id }) => ({ type: "App" as const, id: _id })),
            "App",
          ]
          : ["App"],
    }),


    // Get user app statistics
    getUserAppStats: builder.query<GetUserAppStatsResponse, void>({
      query: () => "/apps/stats",
      providesTags: ["App", "Dashboard"],
    }),

    // Get single app by ID
    getApp: builder.query<GetAppResponse, string>({
      query: (id) => `/apps/${id}`,
      providesTags: (result, error, id) => [{ type: "App", id }],
    }),

    // Update app
    updateApp: builder.mutation<UpdateAppResponse, { id: string } & UpdateAppRequest>({
      query: ({ id, ...updateData }) => ({
        url: `/apps/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "App", id },
        "App",
        "Dashboard",
      ],
    }),

    // Delete app
    deleteApp: builder.mutation<DeleteAppResponse, string>({
      query: (id) => ({
        url: `/apps/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "App", id },
        "App",
        "Dashboard",
      ],
    }),
  }),
});

export const {
  useCheckAppRiskMutation,
  useGetUserAppsQuery,
  useGetUserAppStatsQuery,
  useGetAppQuery,
  useUpdateAppMutation,
  useDeleteAppMutation,
} = appsApi;