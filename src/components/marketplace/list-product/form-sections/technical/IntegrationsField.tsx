
import { UseFormReturn } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ListProductFormData } from "../../types";

interface IntegrationsFieldProps {
  form: UseFormReturn<ListProductFormData>;
}

const INTEGRATIONS = [
  { id: "zapier", label: "Zapier" },
  { id: "slack", label: "Slack" },
  { id: "google_workspace", label: "Google Workspace" },
  { id: "microsoft_365", label: "Microsoft 365" },
  { id: "notion", label: "Notion" },
  { id: "salesforce", label: "Salesforce" },
  { id: "shopify", label: "Shopify" },
  { id: "woocommerce", label: "WooCommerce" },
  { id: "hubspot", label: "HubSpot" },
  { id: "other", label: "Other (please specify)" }
];

export function IntegrationsField({ form }: IntegrationsFieldProps) {
  const selectedIntegrations = form.watch("integrations") || [];
  const hasOther = selectedIntegrations.includes("other");

  return (
    <>
      <FormField
        control={form.control}
        name="integrations"
        render={() => (
          <FormItem>
            <FormLabel>Integrations</FormLabel>
            <FormDescription>
              Select all the integrations your product supports
            </FormDescription>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {INTEGRATIONS.map((integration) => (
                <FormField
                  key={integration.id}
                  control={form.control}
                  name="integrations"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={integration.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(integration.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              return checked
                                ? field.onChange([...currentValues, integration.id])
                                : field.onChange(
                                    currentValues.filter(
                                      (value) => value !== integration.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {integration.label}
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

      {hasOther && (
        <FormField
          control={form.control}
          name="integrations_other"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Integrations</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Please specify other integrations" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
