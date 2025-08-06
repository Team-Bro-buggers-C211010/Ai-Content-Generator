import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-gray-800">
            4<span className="text-blue-600">0</span>4
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-lg">
            The page you are looking for could not be found.
          </p>
          <p className="text-gray-600 text-lg">
            Our team is working to resolve this issue. Please try again later or
            return to the homepage.
          </p>
          <Link href="/" passHref>
            <Button
              className="mt-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              aria-label="Return to homepage"
            >
              Return to Homepage
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
