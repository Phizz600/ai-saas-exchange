
import { CheckCircle } from "lucide-react";

interface ConfirmationScreenProps {
  email: string;
}

export const ConfirmationScreen = ({ email }: ConfirmationScreenProps) => {
  return (
    <div className="text-center space-y-3 sm:space-y-4 py-2 sm:py-4">
      <div className="text-[#6366f1] text-3xl sm:text-4xl mb-4 sm:mb-6">✉️</div>
      <h3 className="text-lg sm:text-xl font-bold text-[#10b981] mb-2 sm:mb-4">
        Your Valuation is on the Way!
      </h3>
      <p className="text-sm sm:text-base">
        We've sent your personalized AI SaaS valuation to{" "}
        <span className="font-semibold">{email}</span>
      </p>
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-600">
          Check your inbox in the next 5 minutes. The email will include your valuation range
          and instructions on how to list your business on AI Exchange.
        </p>
      </div>
      <p className="flex items-center justify-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
        <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
        Similar AI SaaS businesses receive their first qualified offer within 14 days of listing
      </p>
    </div>
  );
};
