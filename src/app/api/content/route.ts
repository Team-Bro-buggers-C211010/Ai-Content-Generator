import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { ContentType } from "@/types";

const contentTypeEnum = z.enum([
  "blog-post",
  "social-media",
  "seo-optimized",
  "dialogue",
  "email-campaign",
  "content-repurposing",
  "brand-voice",
]);

const contentSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  userId: z.string().min(1, "User ID is required"),
  contentType: contentTypeEnum.optional(),
});

async function generateAIContent(
  prompt: string,
  contentType: ContentType = "blog-post"
): Promise<string> {
  try {
    // Define content-specific instructions
    const contentInstructions = {
      "blog-post": {
        system:
          "You are a professional blog writer. Create a well-structured blog post with an engaging introduction, key points, detailed explanations, and a compelling conclusion.",
        user: `Write a comprehensive blog post about: ${prompt}`,
      },
      "social-media": {
        system:
          "You are a social media expert. Create engaging posts for platforms like Instagram, Twitter, LinkedIn, and TikTok. Include relevant hashtags and emojis.",
        user: `Create social media content about: ${prompt}`,
      },
      "seo-optimized": {
        system:
          "You are an SEO expert. Create content optimized for search engines with proper keyword placement, headings, and meta-friendly structure.",
        user: `Generate SEO-optimized content about: ${prompt}`,
      },
      dialogue: {
        system:
          "You are a dialogue specialist. Create realistic conversations between characters with distinct voices and personalities.",
        user: `Generate a dialogue about: ${prompt}`,
      },
      "email-campaign": {
        system:
          "You are an email marketing specialist. Create persuasive email campaigns with compelling subject lines and clear calls to action.",
        user: `Create an email campaign about: ${prompt}`,
      },
      "content-repurposing": {
        system:
          "You are a content strategist. Repurpose long-form content into multiple formats like social posts, emails, and summaries.",
        user: `Repurpose this content: ${prompt}`,
      },
      "brand-voice": {
        system:
          "You are a brand voice specialist. Adapt the content to match the brand's tone and style guidelines.",
        user: `Create content in brand voice about: ${prompt}`,
      },
    };

    // Handle text-based content types
    const { system, user } = contentInstructions[contentType];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Content Generator",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: system,
            },
            {
              role: "user",
              content: user,
            },
          ],
          max_tokens: 700,
          temperature: 0.65,
          top_p: 0.9,
          frequency_penalty: 0.2,
          presence_penalty: 0.1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${await response.text()}`
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid API response format");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Content generation error:", error);
    throw new Error("Failed to generate content");
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt, userId, contentType } = contentSchema.parse(body);

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Invalid user" }, { status: 403 });
    }

    const output = await generateAIContent(
      prompt,
      (contentType as ContentType) || "blog-post"
    );

    const content = await prisma.content.create({
      data: {
        userId,
        prompt,
        contentType: contentType || "blog-post",
        output,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("Content creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues.map((issue) => issue.message) },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contents = await prisma.content.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contents);
  } catch (error) {
    console.error("Content fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
