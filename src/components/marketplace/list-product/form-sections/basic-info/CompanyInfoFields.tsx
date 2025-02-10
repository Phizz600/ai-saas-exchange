
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Info, Users } from "lucide-react";
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

interface CompanyInfoFieldsProps {
  form: UseFormReturn<ListProductFormData>;
}

export function CompanyInfoFields({ form }: CompanyInfoFieldsProps) {
  const employeeRanges = [
    "1-5",
    "6-10",
    "11-25",
    "26-50",
    "51-100",
    "101-250",
    "251-500",
    "500+"
  ];

  const productAgeRanges = [
    "Less than 6 months",
    "6-12 months",
    "1-2 years",
    "2-5 years",
    "5+ years"
  ];

  return (
    <>
      <FormField
        control={form.control}
        name="productAge"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Product Age
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>How long has your product been in development/operation?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select product age" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {productAgeRanges.map((range) => (
                  <SelectItem key={range} value={range} className="bg-white hover:bg-gray-100">
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
        name="numberOfEmployees"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Number of Employees
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Select the range that best represents your current team size</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select number of employees" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {employeeRanges.map((range) => (
                  <SelectItem key={range} value={range} className="bg-white hover:bg-gray-100">
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
