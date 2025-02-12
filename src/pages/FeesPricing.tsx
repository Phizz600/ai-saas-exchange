
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const FeesPricing = () => {
  return (
    <div className="min-h-screen bg-accent">
      <Navbar />
      <div className="container mx-auto px-4 py-16 mt-24">
        <h1 className="exo-2-heading text-4xl font-bold text-white mb-8">Fees & Pricing</h1>
        
        <div className="space-y-8 text-white/80">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Membership Fees</h2>
            <p>$20 per month for both buyers and sellers.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Listing Fees</h2>
            <p>$100 per listing fee applies when listing your AI SaaS product.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Commission Structure</h2>
            <p>1-3% commission on successful sales of AI SaaS companies.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Payment Processing</h2>
            <p>All transactions are processed securely through Escrow.com to ensure safe and transparent dealings for both parties.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};
