import prisma from "@/lib/prisma";

export async function getContentById(id: string) {
  try {
    const content = await prisma.content.findUnique({
      where: { id },
    });
    if (!content) return null;
    return content;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}
