import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { TrafficMetrics } from "./traffic/TrafficMetrics";
import { GoogleAnalyticsVerification } from "./traffic/GoogleAnalyticsVerification";

interface TrafficSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TrafficSection({ form }: TrafficSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Traffic & Users</h2>
      <TrafficMetrics form={form} />
      <GoogleAnalyticsVerification form={form} />
    </div>
  );
}