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
import { handleCredentialsSignIn } from "../actions/authActions";
import ErrorMessage from "@/components/error-message";
import { logInSchema } from "@/lib/zod";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";

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
      console.log("An unexpected error occurred. Please try again.");
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

          <span className="text-sm text-gray-500 text-center block my-2">
            or
          </span>
          <form className="w-full">
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
