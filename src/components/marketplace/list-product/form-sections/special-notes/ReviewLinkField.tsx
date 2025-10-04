import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface ReviewLinkFieldProps {
  form: UseFormReturn<ListProductFormData>;
}
export function ReviewLinkField({
  form
}: ReviewLinkFieldProps) {
  return <FormField control={form.control} name="reviewLink" render={({
    field
  }) => {}} />;
}