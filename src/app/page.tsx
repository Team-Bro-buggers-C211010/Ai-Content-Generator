import { Home } from "@/components/Home/Home";
import { Features } from "@/components/Features/Features";

export default function Root() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Home />
      <Features />
    </div>
  );
}
