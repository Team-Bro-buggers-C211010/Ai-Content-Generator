import { FormState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: FormState = {
  login: { email: "", password: "" },
  content: { prompt: "" },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setContentForm: (state, action) => {
      state.content = { ...state.content, ...action.payload };
    },
  },
});

export const { setContentForm } = formSlice.actions;
export default formSlice.reducer;
