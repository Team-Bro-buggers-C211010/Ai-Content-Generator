import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Home } from "@/components/Home/Home";

export default function Root() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      <Home />
      <Footer />
    </div>
  );
}