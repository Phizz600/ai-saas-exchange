
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Info, Link, Users } from "lucide-react";
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

interface BasicInfoSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Basics</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="sellerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Your Name
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Your full name or business name</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sellerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Contact Email
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Email where potential buyers can reach you</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Product Title
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Choose a clear, descriptive title that highlights your AI product's main feature or purpose</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your product title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Description
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Provide detailed information about your AI product's features, capabilities, and use cases</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your AI product..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="demoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Link to Product
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Provide a link to your product's website or demo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="https://your-product.com" 
                    {...field}
                    className="pl-9"
                  />
                  <Link className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

