import { getContentById } from "@/app/actions/contentActions";
import ContentDetailModalClient from "@/components/Dashboard/ModalContentDetails";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function ContentDetailModal({
  params,
}: {
  params: { id: string };
}) {
  const { id: contentId } = await params;
  const content = await getContentById(contentId);

  if (!content) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
        <p className="mb-6">The requested content could not be found.</p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return <ContentDetailModalClient content={content} />;
}
