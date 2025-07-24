"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { LoginForm } from '@/types';
import { registerSchema } from "@/lib/zod";
import prisma from './../../lib/prisma';
import { z } from "zod";
import bcrypt from "bcryptjs";

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

export async function handleGoogleSignIn() {
    await signIn("google", {
        redirectTo: "/",
    });
}

export async function handleRegisterUser(data: z.infer<typeof registerSchema>) {
  try {
    // Validate input data
    const { name, email, password } = registerSchema.parse(data);

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "User already exists",
        status: 400
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "User registered successfully",
      status: 201
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(issue => issue.message);
      return {
        success: false,
        error: errorMessages.join(", "),
        status: 400
      };
    }

    // Handle other errors
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Failed to register user",
      status: 500
    };
  }
}