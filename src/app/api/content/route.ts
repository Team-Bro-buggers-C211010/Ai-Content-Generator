import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";

const contentSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  userId: z.string().min(1, "User ID is required"),
});

async function generateAIContent(prompt: string): Promise<string> {
  try {
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
              content:
                "You are a helpful AI assistant that generates detailed and professional blog posts.",
            },
            {
              role: "user",
              content: `Generate a detailed and professional post about ${prompt}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${await response.text()}`
      );
    }

    const data = await response.json();
    console.log("OpenRouter API response:", data);

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
    const { prompt, userId } = contentSchema.parse(body);

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Invalid user" }, { status: 403 });
    }

    const output = await generateAIContent(prompt);

    const content = await prisma.content.create({
      data: {
        userId,
        prompt,
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

export async function GET(request: Request) {
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
