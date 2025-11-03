import { baseApi } from "./baseApi";

export interface CreateVaultEntryRequest {
  applicationName: string;
  websiteUrl?: string;
  username: string;
  password: string;
  notes?: string;
  masterPassword: string;
}

export interface VaultEntry {
  _id: string;
  applicationName: string;
  websiteUrl?: string;
  lastAccessed?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VaultEntriesQuery {
  search?: string;
}

export interface VaultEntriesResponse {
  success: boolean;
  count: number;
  data: VaultEntry[];
}

export interface VaultStatsResponse {
  success: boolean;
  data: {
    totalEntries: number;
    recentEntries: number;
  };
}

export interface DecryptEntryRequest {
  masterPassword: string;
}

export interface DecryptedEntryResponse {
  success: boolean;
  data: {
    id: string;
    applicationName: string;
    websiteUrl?: string;
    username: string;
    password: string;
    notes?: string;
    lastAccessed: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface DecryptedEntry {
  _id: string;
  applicationName: string;
  websiteUrl?: string;
  username: string;
  password: string;
  notes?: string;
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateVaultEntryRequest {
  applicationName?: string;
  websiteUrl?: string;
  username?: string;
  password?: string;
  notes?: string;
  masterPassword: string;
}

export const vaultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createVaultEntry: builder.mutation<VaultEntry, CreateVaultEntryRequest>({
      query: (data) => ({
        url: "/vault",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vault"],
    }),
    
    getVaultEntries: builder.query<VaultEntriesResponse, VaultEntriesQuery>({
      query: (params) => ({
        url: "/vault",
        params,
      }),
      providesTags: ["Vault"],
    }),
    
    getVaultStats: builder.query<VaultStatsResponse, void>({
      query: () => "/vault/stats",
      providesTags: ["Vault"],
    }),
    
    getDecryptedEntry: builder.mutation<DecryptedEntryResponse, { id: string; data: DecryptEntryRequest }>({
      query: ({ id, data }) => ({
        url: `/vault/${id}/decrypt`,
        method: "POST",
        body: data,
      }),
    }),
    
    updateVaultEntry: builder.mutation<VaultEntry, { id: string; data: UpdateVaultEntryRequest }>({
      query: ({ id, data }) => ({
        url: `/vault/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vault"],
    }),
    
    deleteVaultEntry: builder.mutation<void, { id: string; data: DecryptEntryRequest }>({
      query: ({ id, data }) => ({
        url: `/vault/${id}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Vault"],
    }),
  }),
});

export const {
  useCreateVaultEntryMutation,
  useGetVaultEntriesQuery,
  useGetVaultStatsQuery,
  useGetDecryptedEntryMutation,
  useUpdateVaultEntryMutation,
  useDeleteVaultEntryMutation,
} = vaultApi;