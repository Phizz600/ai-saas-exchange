
import { Header } from "@/components/Header";

export function Terms() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 mt-16">
        <h1 className="text-3xl font-bold mb-6 exo-2-heading">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <p className="text-sm text-gray-500 mb-6">Last updated: April 22, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using AI Exchange, you agree to be bound by these Terms of Service.
            If you do not agree to all of these terms, you may not use our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
          <p>
            You must create an account to access certain features of our platform. You are responsible
            for maintaining the confidentiality of your account information and for all activities
            that occur under your account.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Listing and Purchasing Products</h2>
          <p>
            3.1 Sellers are responsible for the accuracy of their listings and must have the legal
            right to sell the products they list.
          </p>
          <p>
            3.2 Buyers agree to complete transactions for products they agree to purchase, subject
            to the terms of the specific listing and any applicable escrow agreements.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Fees and Payments</h2>
          <p>
            4.1 AI Exchange charges fees for certain services as outlined in our Fee Schedule.
          </p>
          <p>
            4.2 All fees are non-refundable unless otherwise specified.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            5.1 Users retain ownership of their intellectual property rights in the content they submit.
          </p>
          <p>
            5.2 By posting content, you grant AI Exchange a non-exclusive, worldwide, royalty-free
            license to use, display, and distribute your content solely for the purpose of operating
            the platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Prohibited Activities</h2>
          <p>
            Users may not engage in any activity that violates applicable laws, infringes on
            others' rights, or interferes with the operation of our platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
          <p>
            AI Exchange reserves the right to terminate or suspend accounts at our discretion,
            without notice, for violations of these Terms or for any other reason.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI EXCHANGE SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of the State of Minnesota, without regard
            to its conflict of law provisions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. Your continued use of the platform after any
            changes indicates your acceptance of the modified Terms.
          </p>
        </div>
      </div>
    </>
  );
}
