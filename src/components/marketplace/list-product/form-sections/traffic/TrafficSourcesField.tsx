import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface TrafficSourcesFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TrafficSourcesField({ form }: TrafficSourcesFieldProps) {
  const trafficSourceOptions = [
    { id: "seo", label: "SEO / Organic Search" },
    { id: "paid_ads", label: "Paid Advertising" },
    { id: "social_media", label: "Social Media" },
    { id: "referrals", label: "Referrals / Word of Mouth" },
    { id: "direct", label: "Direct Traffic" },
    { id: "email", label: "Email Marketing" },
    { id: "partnerships", label: "Partnerships" },
    { id: "content", label: "Content Marketing" },
  ];

  return (
    <FormField
      control={form.control}
      name="trafficSources"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="flex items-center gap-2">
              Traffic Sources
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Select all channels that drive traffic to your product</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {trafficSourceOptions.map((source) => (
              <FormField
                key={source.id}
                control={form.control}
                name="trafficSources"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={source.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(source.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), source.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== source.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {source.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
