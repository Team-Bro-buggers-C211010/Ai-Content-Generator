import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/Header/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Content Generator</h1>
        <p className="text-lg text-gray-600 mb-6">
          Generate high-quality content for blogs, social media, and more with AI.
        </p>
        <Link href="/dashboard">
          <Button size="lg">Get Started</Button>
        </Link>
      </main>
    </div>
  );
}