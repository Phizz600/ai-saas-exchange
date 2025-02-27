
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ExitIntentDialog } from "@/components/ExitIntentDialog";

export const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Footer />
        <ExitIntentDialog />
      </div>
    </div>
  );
};

export default Index;
