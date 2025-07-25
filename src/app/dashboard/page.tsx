"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useGetContentQuery,
  useCreateContentMutation,
} from "@/lib/features/contentApi";
import { setContentForm } from "@/lib/features/formSlice";
import { contentSchema } from "@/lib/zod";
import ReactMarkdown from "react-markdown";
import z from "zod";

type ContentForm = z.infer<typeof contentSchema>;

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { content: formData } = useSelector((state: any) => state.form);
  const {
    data: contents,
    isLoading,
    error: fetchError,
  } = useGetContentQuery(session?.user.id || "", { skip: !session });
  const [createContent, { isLoading: isCreating, error: createError }] =
    useCreateContentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: formData,
  });

  if (status === "loading")
    return <div className="flex justify-center p-4">Loading...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const onSubmit = async (data: ContentForm) => {
    try {
      const response = await createContent({
        prompt: data.prompt,
        userId: session.user.id,
      }).unwrap();
      toast.success("Content successfully generated and saved.");
      reset();
    } catch (err) {
      toast.error(
        createError
          ? "Failed to generate content. Please check your API key or credits."
          : "Failed to generate content. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-6">
        <Card className="max-w-3xl mx-auto shadow-lg border border-gray-200">
          <CardHeader className="bg-gray-100 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              AI Content Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label
                  htmlFor="prompt"
                  className="text-sm font-medium text-gray-700"
                >
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  {...register("prompt")}
                  onChange={(e) =>
                    dispatch(setContentForm({ prompt: e.target.value }))
                  }
                  placeholder="Enter your content prompt (e.g., 'Write a professional email' or 'Give me 5 Bangla jokes')..."
                  className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                {errors.prompt && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.prompt.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                disabled={isCreating}
              >
                {isCreating ? "Generating..." : "Generate Content"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Generated Content
          </h2>
          {isLoading ? (
            <div className="flex justify-center">
              <p className="text-gray-600">Loading content...</p>
            </div>
          ) : fetchError ? (
            <p className="text-red-600">
              Error loading content. Please try again later.
            </p>
          ) : contents?.length ? (
            <div className="space-y-6">
              {contents.map((content: any) => (
                <Card
                  key={content.id}
                  className="shadow-md border border-gray-200"
                >
                  <CardContent className="p-6">
                    <p className="text-gray-700">
                      <strong className="font-medium">Prompt:</strong>{" "}
                      {content.prompt}
                    </p>
                    <div className="mt-2 prose overflow-auto">
                      <strong className="font-medium">Output:</strong>
                      <div className="mt-2">
                        <ReactMarkdown>{content.output}</ReactMarkdown>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      <strong className="font-medium">Created:</strong>{" "}
                      {new Date(content.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No content generated yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
