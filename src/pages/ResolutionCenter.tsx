
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HelpCircle, MessageCircle, FileText, Shield } from "lucide-react";

export const ResolutionCenter = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 exo-2-heading">
              Resolution Center
            </h1>
            <p className="text-lg text-gray-600 mb-10">
              We're here to help resolve any issues you may encounter while using our platform. 
              Our team is committed to providing fair and transparent solutions for all parties involved.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="h-6 w-6 text-[#8B5CF6]" />
                  <h2 className="text-xl font-semibold">Dispute Resolution</h2>
                </div>
                <p className="text-gray-600">
                  Having a dispute with another user? Submit your case and our mediation team will help 
                  find a fair resolution for all parties involved.
                </p>
                <button className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white rounded-md hover:opacity-90 transition-opacity">
                  Submit a Dispute
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="h-6 w-6 text-[#8B5CF6]" />
                  <h2 className="text-xl font-semibold">Mediation Services</h2>
                </div>
                <p className="text-gray-600">
                  Need a neutral third party? Our certified mediators can help facilitate productive 
                  conversations to reach mutually acceptable solutions.
                </p>
                <button className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white rounded-md hover:opacity-90 transition-opacity">
                  Request Mediation
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-[#8B5CF6]" />
                  <h2 className="text-xl font-semibold">File a Complaint</h2>
                </div>
                <p className="text-gray-600">
                  Encountered a serious issue with another user or a transaction? File a formal complaint and 
                  our team will investigate the matter thoroughly.
                </p>
                <button className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white rounded-md hover:opacity-90 transition-opacity">
                  File a Complaint
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-[#8B5CF6]" />
                  <h2 className="text-xl font-semibold">Safety Center</h2>
                </div>
                <p className="text-gray-600">
                  Learn about our policies to protect users, how we handle sensitive information, and 
                  steps we take to ensure a safe marketplace experience.
                </p>
                <button className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white rounded-md hover:opacity-90 transition-opacity">
                  Visit Safety Center
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-12">
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">How long does the resolution process take?</h3>
                  <p className="text-gray-600">Most cases are resolved within 5-7 business days, though complex issues may take longer.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Is the resolution service free?</h3>
                  <p className="text-gray-600">Basic resolution services are free. Premium mediation services may incur a fee that will be disclosed upfront.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">What information should I provide when filing a dispute?</h3>
                  <p className="text-gray-600">Include all relevant details such as transaction IDs, communication history, and a clear description of the issue.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Need immediate assistance?</h2>
              <p className="text-gray-600 mb-6">Our support team is available to help you resolve any urgent issues</p>
              <div className="flex justify-center gap-4">
                <button className="py-2 px-6 bg-white border border-[#8B5CF6] text-[#8B5CF6] rounded-md hover:bg-gray-50 transition-colors">
                  Live Chat
                </button>
                <button className="py-2 px-6 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white rounded-md hover:opacity-90 transition-opacity">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResolutionCenter;
