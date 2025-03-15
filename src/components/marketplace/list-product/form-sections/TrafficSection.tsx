import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { TrafficMetrics } from "./traffic/TrafficMetrics";
interface TrafficSectionProps {
  form: UseFormReturn<ListProductFormData>;
}
export function TrafficSection({
  form
}: TrafficSectionProps) {
  return <div className="space-y-8">
      <h2 className="text-2xl font-semibold exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-slate-950">Traffic & Users</h2>
      
      <TrafficMetrics form={form} />
    </div>;
}