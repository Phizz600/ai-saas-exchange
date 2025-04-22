
import { Header } from "@/components/Header";

export function NdaPolicy() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 mt-16">
        <h1 className="text-3xl font-bold mb-6 exo-2-heading">Non-Disclosure Agreement Policy</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
          <p>
            At AI Exchange, we understand the importance of protecting confidential information
            when buying and selling AI products and businesses. Our NDA policy ensures that 
            sensitive details about products are only shared with serious, verified buyers who 
            have agreed to maintain confidentiality.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">When an NDA is Required</h2>
          <p>
            An NDA is required for viewing complete details of certain products on our platform, 
            particularly those containing sensitive information such as:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Proprietary algorithms and AI models</li>
            <li>Detailed financial information</li>
            <li>Customer data and acquisition strategies</li>
            <li>Technical documentation and source code details</li>
            <li>Business strategies and competitive advantages</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">NDA Signing Process</h2>
          <p>
            When you encounter a product that requires an NDA, you'll be prompted to sign our 
            standard NDA agreement before gaining access to full product details. Here's how 
            the process works:
          </p>
          <ol className="list-decimal pl-6 my-4">
            <li>Click "Sign NDA to View Details" on the product page</li>
            <li>Review the NDA terms carefully</li>
            <li>Confirm your agreement electronically</li>
            <li>Gain immediate access to the protected product information</li>
          </ol>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Legal Enforcement</h2>
          <p>
            All NDAs on our platform are legally binding contracts. We maintain secure records 
            of all signed NDAs, including timestamps, IP addresses, and device information to 
            ensure enforceability. Violations of NDAs are taken seriously and may result in:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Immediate suspension of platform access</li>
            <li>Legal action for damages</li>
            <li>Reporting to relevant authorities</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
          <p>
            If you have questions about our NDA policy or need a custom NDA arrangement,
            please contact our legal team at legal@aiexchange.com.
          </p>
        </div>
      </div>
    </>
  );
}
