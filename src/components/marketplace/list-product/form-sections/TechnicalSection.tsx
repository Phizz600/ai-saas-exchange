import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TechnicalSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TechnicalSection({ form }: TechnicalSectionProps) {
  const techStacks = [
    "TensorFlow",
    "PyTorch",
    "OpenAI",
    "Hugging Face",
    "Custom ML",
    "Other"
  ];

  const integrations = [
    "Slack",
    "Salesforce",
    "AWS",
    "Google Cloud",
    "Azure",
    "Other"
  ];

  const stages = [
    "MVP",
    "Beta",
    "Production Ready",
    "Revenue Generating",
    "Scaling"
  ];

  const watchTechStack = form.watch("techStack");
  const watchIntegrations = form.watch("integrations");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Technical</h2>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Tech Stack
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Primary technology used in your AI product</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select tech stack" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {techStacks.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchTechStack === "Other" && (
          <FormField
            control={form.control}
            name="techStackOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specify Tech Stack</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your tech stack" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="integrations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Integrations
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Key platforms your product integrates with</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select integration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {integrations.map((integration) => (
                    <SelectItem key={integration} value={integration}>
                      {integration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchIntegrations === "Other" && (
          <FormField
            control={form.control}
            name="integrationsOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specify Integration</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your integration" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Development Stage
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Current development phase of your product</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
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
          name="demoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Demo URL
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Link to a live demo or product walkthrough</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
