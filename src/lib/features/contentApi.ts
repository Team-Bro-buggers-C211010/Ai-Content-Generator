import { Content } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Content"],
  endpoints: (builder) => ({
    getContent: builder.query<Content[], string>({
      query: (userId) => ({
        url: "/content",
        params: { userId },
      }),
      providesTags: ["Content"],
    }),
    createContent: builder.mutation<Content, { prompt: string; userId: string, contentType: string }>({
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
