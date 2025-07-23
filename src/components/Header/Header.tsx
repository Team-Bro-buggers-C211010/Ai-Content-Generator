import { getServerSession } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function Header() {
  const session = await getServerSession(authOptions);

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
              <form action="/api/auth/signout" method="POST">
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
        <MobileMenu session={session} />
      </div>
    </nav>
  );
}
