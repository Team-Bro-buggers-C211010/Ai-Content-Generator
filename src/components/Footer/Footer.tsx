import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 w-full">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
          <Link
            href="/"
            className="hover:text-indigo-400 transition-colors duration-300"
          >
            About
          </Link>
          <Link
            href="/"
            className="hover:text-indigo-400 transition-colors duration-300"
          >
            Contact
          </Link>
          <Link
            href="/"
            className="hover:text-indigo-400 transition-colors duration-300"
          >
            Privacy Policy
          </Link>
        </div>
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} AI Content Generator. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
