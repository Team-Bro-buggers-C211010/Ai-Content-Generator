import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RegisterForm, Content } from "@/types";

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Content"],
  endpoints: (builder) => ({
    generateContent: builder.mutation<{ content: string }, { prompt: string }>({
      query: (body) => ({
        url: "/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Content"],
    }),
    getUserContents: builder.query<Content[], void>({
      query: () => "/content",
      providesTags: ["Content"],
    }),
    registerUser: builder.mutation<{ message: string }, RegisterForm>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGenerateContentMutation,
  useGetUserContentsQuery,
  useRegisterUserMutation,
} = contentApi;
