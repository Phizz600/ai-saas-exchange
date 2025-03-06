
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { TrafficMetrics } from "./traffic/TrafficMetrics";
import { GoogleAnalyticsVerification } from "./traffic/GoogleAnalyticsVerification";
import { Separator } from "@/components/ui/separator";

interface TrafficSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TrafficSection({ form }: TrafficSectionProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] text-transparent bg-clip-text">Traffic & Users</h2>
      
      <TrafficMetrics form={form} />
      
      <Separator className="my-6" />
      
      <div>
        <h3 className="text-xl font-medium mb-4">Traffic Verification</h3>
        <p className="text-gray-600 mb-6">
          Verifying your traffic increases your listing's trustworthiness and attracts serious buyers.
          Connect your Google Analytics account to automatically verify your traffic data.
        </p>
        <GoogleAnalyticsVerification form={form} />
      </div>
    </div>
  );
}
