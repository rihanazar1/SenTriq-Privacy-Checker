import { baseApi } from "./baseApi";

export interface CreateVaultEntryRequest {
  title: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  category?: string;
}

export interface VaultEntry {
  id: string;
  title: string;
  username?: string;
  url?: string;
  notes?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaultEntriesQuery {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface VaultEntriesResponse {
  entries: VaultEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface VaultStatsResponse {
  totalEntries: number;
  categoryCounts: Record<string, number>;
  recentActivity: any[];
}

export interface DecryptEntryRequest {
  masterPassword: string;
}

export interface DecryptedEntryResponse {
  id: string;
  title: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  category?: string;
}

export interface UpdateVaultEntryRequest {
  title?: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  category?: string;
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
    
    deleteVaultEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/vault/${id}`,
        method: "DELETE",
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