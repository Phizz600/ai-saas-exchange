
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Policies = () => {
  return (
    <div className="min-h-screen bg-accent">
      <Navbar />
      <div className="container mx-auto px-4 py-16 mt-24">
        <h1 className="exo-2-heading text-4xl font-bold text-white mb-8">Policies</h1>
        
        <div className="space-y-8 text-white/80">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Refund Policy</h2>
            <p>No refunds are provided for monthly memberships. Listing fee refunds may be considered under certain circumstances on a case-by-case basis.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Auction Policy</h2>
            <p>All auctions are final. The highest bidder at the end of the auction period is obligated to complete the purchase at the winning bid price.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Verification Policy</h2>
            <p>All sellers must undergo a verification process to ensure the authenticity of their listings and protect buyers' interests.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Privacy Policy</h2>
            <p>We are committed to protecting your privacy and handling your data with the utmost care. All personal information is encrypted and securely stored.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};
