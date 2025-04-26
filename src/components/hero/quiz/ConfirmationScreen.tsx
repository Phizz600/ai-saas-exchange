
import { CheckCircle } from "lucide-react";

interface ConfirmationScreenProps {
  email: string;
}

export const ConfirmationScreen = ({ email }: ConfirmationScreenProps) => {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="text-[#6366f1] text-4xl mb-6">✉️</div>
      <h3 className="text-xl font-bold text-[#10b981] mb-4">
        Your Valuation is on the Way!
      </h3>
      <p>
        We've sent your personalized AI SaaS valuation to{" "}
        <span className="font-semibold">{email}</span>
      </p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-600">
          Check your inbox in the next 5 minutes. The email will include your valuation range
          and instructions on how to list your business on AI Exchange.
        </p>
      </div>
      <p className="flex items-center justify-center text-sm text-gray-600 mt-6">
        <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
        Similar AI SaaS businesses receive their first qualified offer within 14 days of listing
      </p>
    </div>
  );
};
