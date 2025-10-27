import { baseApi } from "./baseApi";

// 🔹 Request type for scanning email breach
export interface EmailBreachScanRequest {
  email: string;
}

// 🔹 A single breach record structure
export interface BreachRecord {
  name: string;               // e.g. "Adobe"
  domain?: string;            // e.g. "adobe.com"
  breachDate: string;         // e.g. "2013-10-04"
  addedDate: string;          // when it was added to DB
  dataClasses: string[];      // e.g. ["Email addresses", "Passwords"]
  description?: string;       // optional text about the breach
  verified: boolean;          // true if verified
  pwnCount?: number;          // number of affected accounts
  logoPath?: string;          // optional logo URL
}

// 🔹 Response for scanning an email
export interface EmailBreachScanResponse {
  email: string;
  breaches: BreachRecord[];
  totalBreaches: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

// 🔹 Stats endpoint response
export interface BreachStatsResponse {
  totalScans: number;
  totalBreaches: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

// 🔹 Query params for trends
export interface BreachTrendsQuery {
  period?: "daily" | "weekly" | "monthly";
  startDate?: string;
  endDate?: string;
}

// 🔹 Trend record
export interface BreachTrendRecord {
  date: string;          // e.g. "2025-10-01"
  breachCount: number;   // number of breaches that day/week/month
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
}

// 🔹 Response for trends
export interface BreachTrendsResponse {
  trends: BreachTrendRecord[];
  period: string;
}

// 🔹 Search query
export interface BreachSearchQuery {
  query?: string;
  breach?: string;
  domain?: string;
  limit?: number;
  offset?: number;
}

// 🔹 Search result item
export interface BreachSearchRecord extends BreachRecord {
  email?: string; // sometimes the API may include affected email
}

// 🔹 Search response
export interface BreachSearchResponse {
  records: BreachSearchRecord[];
  total: number;
  limit: number;
  offset: number;
}

// 🔹 API endpoints
export const emailBreachApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    scanEmailBreach: builder.mutation<EmailBreachScanResponse, EmailBreachScanRequest>({
      query: (data) => ({
        url: "/email-breach/scan",
        method: "POST",
        body: data,
      }),
    }),

    getBreachStats: builder.query<BreachStatsResponse, void>({
      query: () => "/email-breach/stats",
    }),

    getBreachTrends: builder.query<BreachTrendsResponse, BreachTrendsQuery>({
      query: (params) => ({
        url: "/email-breach/trends",
        params,
      }),
    }),

    searchBreachRecords: builder.query<BreachSearchResponse, BreachSearchQuery>({
      query: (params) => ({
        url: "/email-breach/search",
        params,
      }),
    }),
  }),
});

// 🔹 Auto-generated hooks
export const {
  useScanEmailBreachMutation,
  useGetBreachStatsQuery,
  useGetBreachTrendsQuery,
  useSearchBreachRecordsQuery,
} = emailBreachApi;
