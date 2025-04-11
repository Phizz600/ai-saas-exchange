
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NdaSection() {
  const form = useFormContext();
  const [ndaEnabled, setNdaEnabled] = useState(false);

  return (
    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Confidentiality Agreement</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Require potential buyers to sign an NDA before viewing sensitive details of your product.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <FormField
          control={form.control}
          name="requires_nda"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setNdaEnabled(checked);
                  }} 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {ndaEnabled && (
        <FormField
          control={form.control}
          name="nda_content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NDA Text (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter custom NDA text or leave blank to use our standard template..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
