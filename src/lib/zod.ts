import { object, string } from "zod";

export const logInSchema = object({
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters"),
});

export const registerSchema = object({
  name: string().min(1, "Name is required"),
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters"),
});

export const contentSchema = object({
  prompt: string().min(1, "Prompt is required"),
});

export const profileSchema = object({
  name: string().min(1, "Name is required"),
});
