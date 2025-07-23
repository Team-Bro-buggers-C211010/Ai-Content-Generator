import { LoginForm, RegisterForm } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  login: LoginForm;
  register: RegisterForm;
}

const initialState: FormState = {
  login: { email: "", password: "" },
  register: { name: "", email: "", password: "" },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setLoginForm: (state, action: PayloadAction<Partial<LoginForm>>) => {
      state.login = { ...state.login, ...action.payload };
    },
    setRegisterForm: (state, action: PayloadAction<Partial<RegisterForm>>) => {
      state.register = { ...state.register, ...action.payload };
    },
    resetForms: (state) => {
      state.login = initialState.login;
      state.register = initialState.register;
    },
  },
});

export const { setLoginForm, setRegisterForm, resetForms } = formSlice.actions;
export default formSlice.reducer;
