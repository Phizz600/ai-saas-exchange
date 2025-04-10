
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { handleProductUpdate } from "../list-product/utils/formSubmissionHandler";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ListProductFormData } from "../list-product/types";
import { BasicInfoSection } from "./edit-form/BasicInfoSection";
import { MonetizationSection } from "./edit-form/MonetizationSection";
import { FinancialSection } from "./edit-form/FinancialSection";

interface EditProductDialogProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

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
      // Update names for Dutch Auction fields
      startingPrice: product.starting_price,
      reservePrice: product.min_price, // Use min_price for reservePrice
      priceDecrement: product.price_decrement,
      priceDecrementInterval: product.price_decrement_interval,
      auctionEndTime: product.auction_end_time ? new Date(product.auction_end_time) : undefined,
    },
  });

  const onSubmit = async (data: Partial<ListProductFormData>) => {
    const success = await handleProductUpdate(product.id, data, setIsSubmitting);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BasicInfoSection form={form} />
              <MonetizationSection form={form} />
              <FinancialSection form={form} />
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
};
