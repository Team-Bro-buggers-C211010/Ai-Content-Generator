import { getContentById } from "@/app/actions/contentActions";
import ContentDetailModalClient from "@/components/Dashboard/ModalContentDetails";


export default async function ContentDetailModal({
  params,
}: {
  params: { id: string };
}) {
  const { id: contentId } = await params;
  const content = await getContentById(contentId);

  return <ContentDetailModalClient content={content} />;
}
