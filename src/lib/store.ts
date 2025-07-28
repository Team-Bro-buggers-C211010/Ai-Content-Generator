import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { contentApi } from "./features/contentApi";
import formReducer from "./features/formSlice";
import { profileApi } from "./features/profileApi";

export const store = configureStore({
  reducer: {
    [contentApi.reducerPath]: contentApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    form: formReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contentApi.middleware, profileApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
