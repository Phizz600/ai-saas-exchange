import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-accent">
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Index;