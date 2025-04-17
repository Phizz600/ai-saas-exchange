import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { TrafficMetrics } from "./traffic/TrafficMetrics";
import { Card } from "@/components/ui/card";
interface TrafficSectionProps {
  form: UseFormReturn<ListProductFormData>;
}
export function TrafficSection({
  form
}: TrafficSectionProps) {
  return <Card className="p-6 bg-white shadow-sm">
      <h2 className="font-semibold exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-slate-50 mb-6 text-[8B5CF6]">Traffic & Users</h2>
      
      <TrafficMetrics form={form} />
    </Card>;
}