import { baseApi } from "./baseApi";



export interface GenerateFakeDataRequest {
  fields: string[];              
  count: number;                 
  format?: "json" | "csv" | "xml"; 
  locale?: string;              
}

export type GeneratedRecord = Record<string, string | number | boolean | null>;

export interface GeneratedDataResponse {
  data: GeneratedRecord[];       
  count: number;                
  format: string;                
  generatedAt: string;           
}

export interface AvailableField {
  name: string;                  
  category: string;              
  description: string;           
  examples: string[];            
}

export interface AvailableFieldsResponse {
  fields: AvailableField[];    
  categories: string[];          
}

export interface SampleDataResponse {
  success: boolean;
  message: string;
  data: Record<string, any>;
}



export const fakeDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Generate fake data
    generateFakeData: builder.mutation<GeneratedDataResponse, GenerateFakeDataRequest>({
      query: (data) => ({
        url: "/fake-data/generate",
        method: "POST",
        body: data,
      }),
    }),

    // Fetch available fields
    getAvailableFields: builder.query<AvailableFieldsResponse, void>({
      query: () => "/fake-data/fields",
    }),

    // Fetch sample data
    getSampleData: builder.query<SampleDataResponse, void>({
      query: () => "/fake-data/sample",
    }),
  }),
});


export const {
  useGenerateFakeDataMutation,
  useGetAvailableFieldsQuery,
  useGetSampleDataQuery,
} = fakeDataApi;
