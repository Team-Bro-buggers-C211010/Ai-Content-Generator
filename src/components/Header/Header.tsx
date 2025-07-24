"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/app/actions/authActions";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { data: session } = useSession();

  console.log("Session in Header:", session);

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AI Content Generator
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <form action={handleSignOut}>
                <Button variant="outline" type="submit">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          className="md:hidden focus:outline-none" // Only show on mobile
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-2 py-2">
          {" "}
          {/* Added py-2 for padding within the expanded menu */}
          {session ? (
            <>
              <Link href="/dashboard" onClick={toggleMenu}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-gray-700"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile" onClick={toggleMenu}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-gray-700"
                >
                  Profile
                </Button>
              </Link>
              <form action={handleSignOut}>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left border-gray-600 hover:bg-gray-700"
                >
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" onClick={toggleMenu}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-gray-700"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={toggleMenu}>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left border-gray-600 hover:bg-gray-700"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
