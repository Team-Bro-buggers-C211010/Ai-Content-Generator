import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Content"],
  endpoints: (builder) => ({
    getContent: builder.query<any[], string>({
      query: (userId) => ({
        url: "/content",
        params: { userId },
      }),
      providesTags: ["Content"],
    }),
    createContent: builder.mutation<any, { prompt: string; userId: string }>({
      query: (data) => ({
        url: "/content",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Content"],
    }),
  }),
});

export const { useGetContentQuery, useCreateContentMutation } = contentApi;
