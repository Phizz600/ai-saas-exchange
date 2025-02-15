
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleProductUpdate } from "../list-product/utils/formSubmissionHandler";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ListProductFormData } from "../list-product/types";

interface EditProductDialogProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const MONETIZATION_OPTIONS = [
  'subscription',
  'pay_per_use',
  'freemium',
  'one_time_purchase',
  'usage_based',
  'tiered_pricing',
  'enterprise_licensing',
  'marketplace_commission',
  'advertising',
  'data_monetization',
  'affiliate',
  'other'
] as const;

export const EditProductDialog = ({ product, isOpen, onClose }: EditProductDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<Partial<ListProductFormData>>({
    defaultValues: {
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stage: product.stage,
      industry: product.industry,
      monthlyRevenue: product.monthly_revenue,
      monthlyProfit: product.monthly_profit,
      grossProfitMargin: product.gross_profit_margin,
      monthlyChurnRate: product.monthly_churn_rate,
      monthlyTraffic: product.monthly_traffic?.toString(),
      activeUsers: product.active_users,
      techStack: Array.isArray(product.tech_stack) ? product.tech_stack[0] : null,
      techStackOther: product.tech_stack_other,
      teamSize: product.team_size,
      hasPatents: product.has_patents,
      competitors: product.competitors,
      demoUrl: product.demo_url,
      productAge: product.product_age,
      businessLocation: product.business_location,
      specialNotes: product.special_notes,
      numberOfEmployees: product.number_of_employees,
      customerAcquisitionCost: product.customer_acquisition_cost,
      monetization: product.monetization_other ? 'other' : product.monetization,
      monetizationOther: product.monetization_other,
    },
  });

  const onSubmit = async (data: Partial<ListProductFormData>) => {
    const success = await handleProductUpdate(product.id, data, setIsSubmitting);
    if (success) {
      onClose();
    }
  };

  const showMonetizationOther = form.watch('monetization') === 'other';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monetization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monetization Strategy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select monetization strategy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="item-aligned" className="bg-white">
                        {MONETIZATION_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showMonetizationOther && (
                <FormField
                  control={form.control}
                  name="monetizationOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Monetization Strategy</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Describe your monetization strategy" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="monthlyRevenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Revenue</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyProfit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Profit</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
