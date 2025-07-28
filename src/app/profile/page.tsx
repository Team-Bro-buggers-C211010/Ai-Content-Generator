"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfileMutation } from "@/lib/features/profileApi";
import { profileSchema } from "@/lib/zod";
import { toast } from "sonner";

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user.name || "",
      email: session?.user.email || "",
    },
  });

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile({
        id: session.user.id,
        name: data.name,
        email: data.email,
      }).unwrap();
      toast("Profile updated successfully.", {
        description: "You can find it in your dashboard.",
      });
      reset(data);
    } catch (err) {
      toast("Failed to update profile", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              {session.user.image && (
                <div>
                  <Label>Profile Picture</Label>
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mt-2"
                  />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
