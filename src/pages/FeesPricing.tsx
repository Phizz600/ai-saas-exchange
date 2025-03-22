import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
export const FeesPricing = () => {
  return <div className="min-h-screen bg-accent">
      <Navbar />
      <div className="container mx-auto px-4 py-16 mt-24">
        <h1 className="exo-2-heading text-4xl font-bold text-white mb-8">Fees & Pricing</h1>
        
        <div className="space-y-8 text-white/80">
          

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Listing Fees</h2>
            <p>$100 per listing fee applies when listing your AI SaaS product.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Commission Structure</h2>
            <p>Our tiered commission structure is based on the final selling price:</p>
            
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="bg-white/10">
                  <TableRow>
                    <TableHead className="text-white font-semibold">Final Selling Price</TableHead>
                    <TableHead className="text-white font-semibold">Commission Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-white/5">
                    <TableCell className="text-white/90">$0 - $10,000</TableCell>
                    <TableCell className="text-white/90">10%</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-white/5">
                    <TableCell className="text-white/90">$10,001 - $50,000</TableCell>
                    <TableCell className="text-white/90">8%</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-white/5">
                    <TableCell className="text-white/90">$50,001 - $100,000</TableCell>
                    <TableCell className="text-white/90">6%</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-white/5">
                    <TableCell className="text-white/90">$100,001+</TableCell>
                    <TableCell className="text-white/90">5%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Payment Processing</h2>
            <p>All transactions are processed securely through Escrow.com to ensure safe and transparent dealings for both parties.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>;
};