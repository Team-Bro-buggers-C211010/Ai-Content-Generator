import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Providers } from "@/lib/providers";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Content Generator",
  description: "Generate high-quality content with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
