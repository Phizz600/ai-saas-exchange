
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageUpload } from "../ImageUpload";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";

interface ImageSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function ImageSection({ form }: ImageSectionProps) {
  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Product Logo
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-white">
                  <p>Recommended logo specifications:</p>
                  <ul className="list-disc ml-4 mt-1">
                    <li>Maximum size: 5MB</li>
                    <li>Optimal dimensions: 512x512 pixels</li>
                    <li>Accepted formats: JPG, PNG, WebP</li>
                    <li>Square aspect ratio recommended</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
