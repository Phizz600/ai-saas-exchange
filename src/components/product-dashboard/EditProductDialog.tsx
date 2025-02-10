
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditProductDialogProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    monthly_revenue?: number;
    monthly_traffic?: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EditProductFormData {
  title: string;
  description: string;
  price: number;
  monthly_revenue: number;
  monthly_traffic: number;
}

export function EditProductDialog({ product, isOpen, onClose }: EditProductDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<EditProductFormData>({
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      monthly_revenue: product?.monthly_revenue || 0,
      monthly_traffic: product?.monthly_traffic || 0,
    },
  });

  const onSubmit = async (data: EditProductFormData) => {
    try {
      if (!product?.id) return;

      const { error } = await supabase
        .from('products')
        .update({
          title: data.title,
          description: data.description,
          price: data.price,
          monthly_revenue: data.monthly_revenue,
          monthly_traffic: data.monthly_traffic,
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: "Your product has been successfully updated.",
      });

      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="description"
              render={({ field }) => (
                <FormItem>
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthly_revenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Revenue ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthly_traffic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Traffic</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
