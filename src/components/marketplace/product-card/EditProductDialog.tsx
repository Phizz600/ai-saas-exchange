
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { handleProductUpdate } from "../list-product/utils/formSubmissionHandler";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ListProductFormData } from "../list-product/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BasicInfoSection } from "../list-product/form-sections/BasicInfoSection";
import { FinancialSection } from "../list-product/form-sections/FinancialSection";
import { TechnicalSection } from "../list-product/form-sections/TechnicalSection";
import { TrafficSection } from "../list-product/form-sections/TrafficSection";
import { SpecialNotesSection } from "../list-product/form-sections/SpecialNotesSection";
import { PricingSection } from "../list-product/form-sections/PricingSection";

interface EditProductDialogProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProductDialog = ({ product, isOpen, onClose }: EditProductDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ListProductFormData>({
    defaultValues: {
      title: product.title || '',
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      stage: product.stage || '',
      industry: product.industry || '',
      monthlyRevenue: product.monthly_revenue,
      monthlyProfit: product.monthly_profit,
      grossProfitMargin: product.gross_profit_margin,
      monthlyChurnRate: product.monthly_churn_rate,
      monthlyTraffic: product.monthly_traffic?.toString() || '',
      activeUsers: product.active_users || '',
      techStack: Array.isArray(product.tech_stack) ? product.tech_stack[0] || '' : product.tech_stack || '',
      techStackOther: product.tech_stack_other || '',
      teamSize: product.team_size || '',
      hasPatents: product.has_patents || false,
      competitors: product.competitors || '',
      demoUrl: product.demo_url || '',
      productAge: product.product_age || '',
      businessLocation: product.business_location || '',
      specialNotes: product.special_notes || '',
      numberOfEmployees: product.number_of_employees || '',
      customerAcquisitionCost: product.customer_acquisition_cost,
      monetization: product.monetization_other ? 'other' : product.monetization || '',
      monetizationOther: product.monetization_other || '',
      llmType: product.llm_type || '',
      llmTypeOther: product.llm_type_other || '',
      integrations: product.integrations || [],
      integrations_other: product.integrations_other || '',
      deliverables: product.deliverables || [],
      monthlyExpenses: product.monthly_expenses || [],
      businessType: product.business_type || 'B2B',
      productLink: product.product_link || '',
      image: null, // File input will handle this differently
      isVerified: false,
      accuracyAgreement: false,
      termsAgreement: false,
    },
  });

  const onSubmit = async (data: ListProductFormData) => {
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
            <Accordion type="multiple" defaultValue={["basics", "financials", "technical"]} className="w-full">
              <AccordionItem value="basics">
                <AccordionTrigger className="text-lg font-semibold">
                  Basics
                </AccordionTrigger>
                <AccordionContent>
                  <BasicInfoSection form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="financials">
                <AccordionTrigger className="text-lg font-semibold">
                  Financials
                </AccordionTrigger>
                <AccordionContent>
                  <FinancialSection form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="technical">
                <AccordionTrigger className="text-lg font-semibold">
                  Technical Details
                </AccordionTrigger>
                <AccordionContent>
                  <TechnicalSection form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="traffic">
                <AccordionTrigger className="text-lg font-semibold">
                  Traffic & Users
                </AccordionTrigger>
                <AccordionContent>
                  <TrafficSection form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="special-notes">
                <AccordionTrigger className="text-lg font-semibold">
                  Special Notes
                </AccordionTrigger>
                <AccordionContent>
                  <SpecialNotesSection form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="selling-method">
                <AccordionTrigger className="text-lg font-semibold">
                  Selling Method
                </AccordionTrigger>
                <AccordionContent>
                  <PricingSection form={form} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end gap-2 pt-4 border-t">
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
