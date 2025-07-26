// app/content/[id]/ContentDetailModalClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Content } from "@/types";

export default function ContentDetailModalClient({
  content,
}: {
  content: Content;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  // Handle dialog state and routing
  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  if (!content) {
    return (
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Content Not Found</DialogTitle>
            <DialogDescription>
              The requested content could not be found.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Content Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Created on: {format(new Date(content.createdAt), "MMMM dd, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Prompt</h3>
            <p className="text-gray-900">{content.prompt}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">Generated Content</h3>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {content.output.split(/\s+/).length} words
              </span>
            </div>
            <div className="prose max-w-none">
              <ReactMarkdown>{content.output}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-300"
            >
              Close
            </Button>
            <Button asChild>
              <a href={`/content/${content.id}`} className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Page
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
