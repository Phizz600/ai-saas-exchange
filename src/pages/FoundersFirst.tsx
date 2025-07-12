
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FounderHero } from "@/components/founders/FounderHero";
import { FounderBuiltAroundYou } from "@/components/founders/FounderBuiltAroundYou";
import { FounderValueStack } from "@/components/founders/FounderValueStack";
import { FounderTestimonials } from "@/components/founders/FounderTestimonials";
import { FounderTrust } from "@/components/founders/FounderTrust";
import { FounderCTA } from "@/components/founders/FounderCTA";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";

export const FoundersFirst = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AnimatedGradientBackground>
          <div className="pt-16">
            <FounderHero />
          </div>
        </AnimatedGradientBackground>
        <div className="bg-gray-50">
          <FounderBuiltAroundYou />
          <FounderValueStack />
          <FounderTestimonials />
          <FounderTrust />
          <FounderCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
};
