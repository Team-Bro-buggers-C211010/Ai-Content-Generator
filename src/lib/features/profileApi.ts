import { ProfileResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      ProfileResponse,
      { id: string; name: string; image?: string }
    >({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation } = profileApi;
