
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrafficMetricsProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TrafficMetrics({ form }: TrafficMetricsProps) {
  const trafficRanges = [
    "0-1,000",
    "1,001-5,000",
    "5,001-10,000",
    "10,001-50,000",
    "50,001-100,000",
    "100,001+"
  ];

  const userRanges = [
    "0-100",
    "101-500",
    "501-1,000",
    "1,001-5,000",
    "5,001-10,000",
    "10,000+"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="monthlyTraffic"
        rules={{ required: "Monthly traffic is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Monthly Traffic <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Monthly visitors or API calls</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select traffic range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {trafficRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="activeUsers"
        rules={{ required: "Monthly active users is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Monthly Active Users <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Number of monthly active users</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select user range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {userRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
