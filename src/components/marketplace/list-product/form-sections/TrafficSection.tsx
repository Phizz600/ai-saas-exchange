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
  return <Card className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
      <h2 className="exo-2-header bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text mb-6 text-violet-500 font-semibold text-2xl">Traffic & Users</h2>
      
      <TrafficMetrics form={form} />
    </Card>;
}