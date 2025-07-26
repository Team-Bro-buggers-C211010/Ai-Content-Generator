"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useGetContentQuery,
  useCreateContentMutation,
} from "@/lib/features/contentApi";
import { contentSchema } from "@/lib/zod";
import ReactMarkdown from "react-markdown";
import z from "zod";
import {
  BarChart3,
  Sparkles,
  FileText,
  History,
  ExternalLink,
} from "lucide-react";
import { DashBoardSkelsLoad } from "@/components/Skeletons/DashBoardSkelsLoad";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Content } from "@/types";

type ContentForm = z.infer<typeof contentSchema>;

export default function Dashboard() {
  const [contentType, setContentType] = useState<
    "blog-post" | "content" | "dialogues" | "seo-optimized"
  >("content");
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    data: contents = [],
    isLoading,
    error: fetchError,
    refetch,
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
  });

  // Redirect if unauthenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Loading state
  if (status === "loading" || isLoading) {
    return <DashBoardSkelsLoad />;
  }

  const onSubmit = async (data: ContentForm) => {
    try {
      await createContent({
        prompt: data.prompt,
        userId: session!.user.id,
        contentType,
      }).unwrap();

      toast.success("Content successfully generated and saved.", {
        description: "You can find it in your dashboard.",
      });

      reset();
      refetch();
    } catch (err) {
      toast.error("Failed to generate content", {
        description: createError
          ? "Please check your API key or credits."
          : "Please try again later.",
      });
      console.log(err);
    }
  };

  // Stats calculations
  const contentCount = contents.length;
  const latestContent = contentCount > 0 ? contents[0] : null;
  const wordCount = latestContent
    ? latestContent.output.split(/\s+/).length
    : 0;
  const avgWords =
    contentCount > 0
      ? contents.reduce((sum, c) => sum + c.output.split(/\s+/).length, 0) /
        contentCount
      : 0;

  // Function to view full content
  const viewFullContent = (contentId: string) => {
    router.push(`/content/${contentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                  Content Analytics
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Your content generation statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Content</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {contentCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Latest Word Count</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {wordCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <History className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Words/Content</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {avgWords.toFixed(0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
                  Generate New Content
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Create AI-powered content with a simple prompt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label
                      htmlFor="prompt"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Content Prompt
                    </Label>
                    <Textarea
                      id="prompt"
                      {...register("prompt")}
                      placeholder="Enter your content prompt (e.g., 'Write a professional email' or 'Give me 5 Bangla jokes')..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm min-h-[120px]"
                    />
                    {errors.prompt && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.prompt.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="contentType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Content Type
                    </Label>
                    <Select
                      value={contentType}
                      onValueChange={(value) => setContentType(value as "blog-post" | "content" | "dialogues" | "seo-optimized")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog-post">Blog Post</SelectItem>
                        <SelectItem value="content">General Content</SelectItem>
                        <SelectItem value="dialogues">Dialogues</SelectItem>
                        <SelectItem value="seo-optimized">
                          SEO Optimized
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Content
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <History className="h-5 w-5 mr-2 text-indigo-600" />
                  Content History
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {contentCount} items
                </span>
              </div>

              {fetchError ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="py-6 text-center">
                    <p className="text-red-700 mb-3">
                      Error loading content history
                    </p>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                      onClick={() => refetch()}
                    >
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : contentCount === 0 ? (
                <Card className="border-dashed border-gray-300 bg-gray-50">
                  <CardContent className="py-10 text-center">
                    <FileText className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-700">
                      No content generated yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Start by creating your first AI-powered content above
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {contents.map((content: Content) => (
                    <Card
                      key={content.id}
                      className="border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800 line-clamp-1">
                                {content.prompt[0].toUpperCase() +
                                  content.prompt.slice(1)}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(content.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="flex justify-center items-center text-sky-500 bg-sky-100 text-sm font-semibold px-1 py-1 rounded">
                                {content.contentType[0].toUpperCase() +
                                  content.contentType.slice(1)}
                              </p>
                              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                                {content.output.split(/\s+/).length} words
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 prose prose-sm max-w-none overflow-hidden">
                          <div className="text-sm text-gray-700 line-clamp-3">
                            <ReactMarkdown>{content.output}</ReactMarkdown>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 text-indigo-600 hover:text-indigo-800 flex items-center"
                          onClick={() => viewFullContent(content.id)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Full Content
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
