
import { Header } from "@/components/Header";
import { NdaHero } from "@/components/nda-policy/NdaHero";
import { NdaFeatures } from "@/components/nda-policy/NdaFeatures";
import { NdaFaq } from "@/components/nda-policy/NdaFaq";
import { NdaCta } from "@/components/nda-policy/NdaCta";

export function NdaPolicy() {
  return (
    <>
      <Header />
      <NdaHero />
      <section className="min-h-[400px] bg-gradient-to-br from-[#D946EE]/70 via-[#8B5CF6]/60 to-[#0EA4E9]/60 px-4 py-16">
        <div className="container mx-auto">
          <NdaFeatures />
          <NdaFaq />
          <NdaCta />
        </div>
      </section>
    </>
  );
}
