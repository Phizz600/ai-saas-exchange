import { Suspense, lazy } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const Hero = lazy(() => import("@/components/Hero"));

const LoadingHero = () => (
  <div className="min-h-screen bg-accent animate-pulse">
    <div className="container mx-auto px-4 py-24">
      <Skeleton className="h-24 w-3/4 mx-auto mb-8" />
      <Skeleton className="h-12 w-1/2 mx-auto mb-12" />
      <Skeleton className="h-12 w-48 mx-auto" />
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-accent">
      <Navbar />
      <Suspense fallback={<LoadingHero />}>
        <Hero />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;