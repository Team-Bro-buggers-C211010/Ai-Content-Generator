import { getContentById } from "@/app/actions/contentActions";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ContentDetailPage(props: PageProps) {
  // const { id: contentId } = await params;
  const content = await getContentById(props.params.id);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Content Not Found
          </h2>
          <p className="text-gray-600">
            The requested content could not be found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="border-b pb-6 mb-8">
            <div className="flex justify-between">
              <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
                {content.prompt[0].toUpperCase() + content.prompt.slice(1)}
              </h1>
              <p className="flex justify-center items-center text-sky-500 bg-sky-100 text-sm font-semibold px-1 py-1 rounded">{content.contentType[0].toUpperCase() + content.contentType.slice(1)}</p>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <span>
                Created on:{" "}
                {format(new Date(content.createdAt), "MMMM dd, yyyy")}
              </span>
              <span className="mx-2">•</span>
              <span>{content.output.split(/\s+/).length} words</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{content.output}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamicParams = true;