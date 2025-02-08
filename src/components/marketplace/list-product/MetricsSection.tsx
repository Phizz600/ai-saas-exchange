
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "./types";
import { TrafficMetrics } from "./metrics/TrafficMetrics";
import { CategoryAndTechStack } from "./metrics/CategoryAndTechStack";
import { TeamSizeMetrics } from "./metrics/TeamSizeMetrics";

interface MetricsSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function MetricsSection({ form }: MetricsSectionProps) {
  return (
    <div className="space-y-6">
      <TrafficMetrics form={form} />
      <CategoryAndTechStack form={form} />
      <TeamSizeMetrics form={form} />
    </div>
  );
}
