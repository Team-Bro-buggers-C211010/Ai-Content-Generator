"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Session } from "next-auth";

export function MobileMenu({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className="md:hidden focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col space-y-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    toggleMenu();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full justify-start">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
