import Link from "next/link";
import { Button } from "../ui/button";

export const Home = () => {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 transition-opacity duration-700 ease-out">
        Welcome to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          AI Content Generator
        </span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto transition-opacity duration-700 ease-out delay-200">
        Create stunning, high-quality content for blogs, social media, and more
        with the power of AI.
      </p>
      <Link href="/dashboard">
        <Button
          size="lg"
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg group"
        >
          <span className="relative z-10">Get Started</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </Button>
      </Link>
    </main>
  );
};
