
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
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

interface LocationIndustryFieldsProps {
  form: UseFormReturn<ListProductFormData>;
}

export function LocationIndustryFields({ form }: LocationIndustryFieldsProps) {
  const industries = [
    "AI/Machine Learning",
    "E-commerce",
    "Education",
    "Enterprise Software",
    "Finance",
    "Healthcare",
    "Marketing",
    "Productivity",
    "Social Media",
    "Other"
  ];

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Japan",
    "South Korea",
    "Singapore",
    "India",
    "Brazil",
    "Mexico",
    "Other"
  ];

  const watchIndustry = form.watch("industry");

  return (
    <>
      <FormField
        control={form.control}
        name="businessLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Business Location
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Where is your business primarily located?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {countries.map((country) => (
                  <SelectItem key={country} value={country} className="bg-white hover:bg-gray-100">
                    {country}
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
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Industry
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Select the primary industry your product serves</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchIndustry === "Other" && (
        <FormField
          control={form.control}
          name="industryOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specify Industry</FormLabel>
              <FormControl>
                <Input placeholder="Enter your industry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
