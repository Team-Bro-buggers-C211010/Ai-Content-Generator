import { object, string } from "zod";

export const logInSchema = object({
    email: string()
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string()
        .min(1, "Password is required")
        .min(6, "Password must be more than 6 characters")
});