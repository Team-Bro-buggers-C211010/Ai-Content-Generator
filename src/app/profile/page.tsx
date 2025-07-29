"use client";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfileMutation } from "@/lib/features/profileApi";
import { profileSchema } from "@/lib/zod";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloudIcon, Loader2 } from "lucide-react";

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
      });
      setPreviewUrl(session.user.image || null);
      setNewImageFile(null);
    }
  }, [session, reset]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setNewImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      return url;
    } catch (err) {
      toast.error("Failed to upload image");
      throw err;
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      let imageUrl = session?.user?.image || "";

      // Upload new image if exists
      if (newImageFile) {
        setImageUploading(true);
        imageUrl = await uploadImage(newImageFile);
        setImageUploading(false);
      }

      // Update profile with name and new image
      await updateProfile({
        id: session!.user.id,
        name: data.name,
        image: imageUrl,
      }).unwrap();

      // Update session
      await updateSession({
        user: {
          ...session!.user,
          name: data.name,
          image: imageUrl,
        },
      });

      toast.success("Profile updated successfully", {
        description: "Your changes have been saved",
      });

      // Reset form state
      reset(data);
      setNewImageFile(null);
    } catch (err) {
      toast.error("Failed to update profile", {
        description: "Please try again later",
      });
      console.log(err);
      setImageUploading(false);
    }
  };

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (status === "unauthenticated" || !session?.user) {
    router.push("/login");
    return null;
  }

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <main className="container mx-auto max-w-2xl">
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
            <CardHeader className="text-white pb-2">
              <CardTitle className="text-2xl font-bold">
                Profile Settings
              </CardTitle>
              <CardDescription className="text-indigo-200">
                Manage your account information
              </CardDescription>
            </CardHeader>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col items-center -mt-16 mb-6">
              <div
                className="relative group cursor-pointer"
                onClick={handleImageClick}
              >
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={previewUrl || ""}
                    alt={session.user.name || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-indigo-500 text-white text-3xl font-medium">
                    {getInitials(session.user.name || "")}
                  </AvatarFallback>
                </Avatar>

                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadCloudIcon className="h-8 w-8 text-white" />
                </div>

                {imageUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <Button
                variant="link"
                className="mt-3 text-indigo-600 font-medium"
                onClick={handleImageClick}
                disabled={imageUploading}
              >
                {imageUploading ? "Uploading..." : "Change profile picture"}
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="mb-2 block font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="mb-2 block font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={session.user.email || ""}
                    readOnly
                    disabled
                    className="py-3 px-4 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-gray-500 text-sm">
                    Email address cannot be changed
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium shadow-sm transition-colors disabled:opacity-70"
                  disabled={
                    isLoading || imageUploading || (!isDirty && !newImageFile)
                  }
                >
                  {isLoading || imageUploading ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
