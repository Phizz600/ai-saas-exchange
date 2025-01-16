import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";

const Index = () => {
  return (
    <div className="min-h-screen bg-accent">
      <Navbar />
      <main>
        <Hero />
        <Stats />
      </main>
    </div>
  );
};

export default Index;