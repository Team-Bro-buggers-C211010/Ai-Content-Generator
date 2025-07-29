import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { CloudinaryResult } from "@/types";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "profile_pictures",
            public_id: `user_${session.user.id}`,
            overwrite: true,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryResult);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: unknown) {
    console.error("Upload error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload image";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
