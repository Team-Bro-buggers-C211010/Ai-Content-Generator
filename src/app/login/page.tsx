"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IoLogoGoogle } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { handleCredentialsSignIn, handleGoogleSignIn } from "../actions/authActions";
import ErrorMessage from "@/components/error-message";
import { logInSchema } from "@/lib/zod";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [globalError, setGlobalError] = useState<string>("");
  const form = useForm<z.infer<typeof logInSchema>>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof logInSchema>) => {
    try {
      const result = await handleCredentialsSignIn(data);

      if (result?.success) {
        window.location.href = "/";
      }

      if (result?.message) {
        setGlobalError(result.message);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again." + error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Welcome Back to <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Content Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button will go here */}
              {form.formState.isSubmitting ? (
                <Button disabled className="w-full">
                  <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                  Signing in...
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              )}
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register here
              </Link>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <form className="w-full" action={handleGoogleSignIn}>
            <Button variant="outline" className="w-full" type="submit">
              <IoLogoGoogle className="h-4 w-4 mr-2" />
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
