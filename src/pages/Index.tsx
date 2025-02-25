
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ExitIntentDialog } from "@/components/ExitIntentDialog";

export const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
      <Navbar />
      <Hero />
      <ExitIntentDialog />
    </div>
  );
};

export default Index;
