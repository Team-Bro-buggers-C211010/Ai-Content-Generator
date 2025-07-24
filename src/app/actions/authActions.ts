"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { LoginForm } from '@/types';

export async function handleCredentialsSignIn({ email, password }: LoginForm) {
    try {
        await signIn("credentials", {
            redirect: false,
            email,
            password
        })
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        message: "Invalid credentials",
                        status: 401
                    }
                default:
                    return {
                        message: "Something went wrong",
                        status: 500
                    }
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut({
        redirectTo: "/login",
    });
}