import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { ContentType } from "@/types";

// Define the content type union
const contentTypeEnum = z.enum(["blog-post", "content", "dialogues", "seo-optimized"]);

// Update your contentSchema
const contentSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  userId: z.string().min(1, "User ID is required"),
  contentType: contentTypeEnum.optional(),
});


async function generateAIContent(
  prompt: string,
  contentType: ContentType = 'content'
): Promise<string> {
  try {
    // Define content-specific instructions
    const contentInstructions: Record<typeof contentType, { system: string, user: string }> = {
      'blog-post': {
        system: "You are a professional blog writer. Create a well-structured blog post with an engaging introduction, key points, detailed explanations, and a compelling conclusion.",
        user: `Write a comprehensive blog post about: ${prompt}`
      },
      'content': {
        system: "You are a content creation expert. Generate informative, engaging content that provides value to readers.",
        user: `Create detailed content about: ${prompt}`
      },
      'dialogues': {
        system: "You are a dialogue specialist. Create realistic conversations between characters with distinct voices and personalities.",
        user: `Generate a dialogue about: ${prompt}`
      },
      'seo-optimized': {
        system: "You are an SEO expert. Create content optimized for search engines with proper keyword placement, headings, and meta-friendly structure.",
        user: `Generate SEO-optimized content about: ${prompt}`
      }
    };

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
              content: system
            },
            {
              role: "user",
              content: user
            }
          ],
          max_tokens: 700,
          temperature: 0.65,
          top_p: 0.9,
          frequency_penalty: 0.2,
          presence_penalty: 0.1
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
    console.error("OpenRouter API error:", error);
    return `Mock AI response for prompt: ${prompt}`;
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

    const output = await generateAIContent(prompt, contentType || "content");

    const content = await prisma.content.create({
      data: {
        userId,
        prompt,
        contentType: contentType || "content",
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

