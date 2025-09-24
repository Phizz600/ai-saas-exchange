
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { ListProductFormData } from "../marketplace/list-product/types";
import { BasicInfoSection } from "../marketplace/list-product/form-sections/BasicInfoSection";
import { FinancialSection } from "../marketplace/list-product/form-sections/FinancialSection";
import { TechnicalSection } from "../marketplace/list-product/form-sections/TechnicalSection";
import { TrafficSection } from "../marketplace/list-product/form-sections/TrafficSection";
import { SpecialNotesSection } from "../marketplace/list-product/form-sections/SpecialNotesSection";
import { PricingSection } from "../marketplace/list-product/form-sections/PricingSection";

interface EditProductDialogProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProductDialog({ product, isOpen, onClose }: EditProductDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ListProductFormData>({
    defaultValues: {
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price,
      category: product?.category || '',
      stage: product?.stage || '',
      industry: product?.industry || '',
      monthlyRevenue: product?.monthly_revenue,
      monthlyProfit: product?.monthly_profit,
      grossProfitMargin: product?.gross_profit_margin,
      monthlyChurnRate: product?.monthly_churn_rate,
      monthlyTraffic: product?.monthly_traffic?.toString() || '',
      activeUsers: product?.active_users || '',
      techStack: Array.isArray(product?.tech_stack) ? product.tech_stack[0] || '' : product?.tech_stack || '',
      techStackOther: product?.tech_stack_other || '',
      teamSize: product?.team_size || '',
      hasPatents: product?.has_patents || false,
      competitors: product?.competitors || '',
      demoUrl: product?.demo_url || '',
      productAge: product?.product_age || '',
      businessLocation: product?.business_location || '',
      specialNotes: product?.special_notes || '',
      numberOfEmployees: product?.number_of_employees || '',
      customerAcquisitionCost: product?.customer_acquisition_cost,
      monetization: product?.monetization_other ? 'other' : product?.monetization || '',
      monetizationOther: product?.monetization_other || '',
      llmType: product?.llm_type || '',
      llmTypeOther: product?.llm_type_other || '',
      integrations: product?.integrations || [],
      integrations_other: product?.integrations_other || '',
      deliverables: product?.deliverables || [],
      monthlyExpenses: product?.monthly_expenses || [],
      businessType: product?.business_type || 'B2B',
      productLink: product?.product_link || '',
      image: null,
      isVerified: false,
      accuracyAgreement: false,
      termsAgreement: false,
    },
  });

  const onSubmit = async (data: ListProductFormData) => {
    if (!product?.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          stage: data.stage,
          industry: data.industry,
          monthly_revenue: data.monthlyRevenue,
          monthly_profit: data.monthlyProfit,
          gross_profit_margin: data.grossProfitMargin,
          monthly_churn_rate: data.monthlyChurnRate,
          monthly_traffic: data.monthlyTraffic ? parseInt(data.monthlyTraffic) : null,
          active_users: data.activeUsers,
          tech_stack: data.techStack ? [data.techStack] : [],
          tech_stack_other: data.techStackOther,
          team_size: data.teamSize,
          has_patents: data.hasPatents,
          competitors: data.competitors,
          demo_url: data.demoUrl,
          product_age: data.productAge,
          business_location: data.businessLocation,
          special_notes: data.specialNotes,
          number_of_employees: data.numberOfEmployees,
          customer_acquisition_cost: data.customerAcquisitionCost,
          monetization: data.monetization === 'other' ? null : data.monetization,
          monetization_other: data.monetization === 'other' ? data.monetizationOther : null,
          llm_type: data.llmType === 'other' ? null : data.llmType,
          llm_type_other: data.llmType === 'other' ? data.llmTypeOther : null,
          integrations: data.integrations,
          integrations_other: data.integrations_other,
          deliverables: data.deliverables,
          monthly_expenses: data.monthlyExpenses,
          business_type: data.businessType,
          product_link: data.productLink,
        })
        .eq('id', product.id);

      if (error) throw error;

      toast.success({
        title: "Product updated",
        description: "Your product has been successfully updated.",
      });

      queryClient.invalidateQueries({ queryKey: ['user-products'] });
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!product?.id) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");
    if (!confirmed) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast.success({
        title: "Product deleted",
        description: "Your product has been successfully deleted.",
      });

      queryClient.invalidateQueries({ queryKey: ['user-products'] });
      onClose();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Accordion type="multiple" defaultValue={["basics", "financials"]} className="w-full">
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

            <DialogFooter className="flex gap-2">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={onDelete}
                disabled={isSubmitting}
                className="bg-red-900 hover:bg-red-800 text-white"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#2052f0] hover:bg-[#1a47d4] text-white">
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
