
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import { EditProductDialog } from "./EditProductDialog";
import { ProductTableRow } from "./table/ProductTableRow";
import { ViewProductDialog } from "./dialogs/ViewProductDialog";
import { DeleteProductDialog } from "./dialogs/DeleteProductDialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Eye, Edit, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  stage: string;
  status?: string;
}

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useIsMobile();

  const handleDelete = async (productId: string) => {
    setIsDeleting(true);
    try {
      console.log('Starting deletion process for product:', productId);

      // Delete notifications first (they reference both bids and products)
      console.log('Deleting related notifications...');
      const {
        error: notificationsError
      } = await supabase.from('notifications').delete().eq('related_product_id', productId);
      if (notificationsError) {
        console.error('Error deleting notifications:', notificationsError);
        throw notificationsError;
      }

      // Delete bids
      console.log('Deleting related bids...');
      const {
        error: bidsError
      } = await supabase.from('bids').delete().eq('product_id', productId);
      if (bidsError) {
        console.error('Error deleting bids:', bidsError);
        throw bidsError;
      }

      // Delete offers
      console.log('Deleting related offers...');
      const {
        error: offersError
      } = await supabase.from('offers').delete().eq('product_id', productId);
      if (offersError) {
        console.error('Error deleting offers:', offersError);
        throw offersError;
      }

      // Delete analytics
      console.log('Deleting product analytics...');
      const {
        error: analyticsError
      } = await supabase.from('product_analytics').delete().eq('product_id', productId);
      if (analyticsError) {
        console.error('Error deleting product analytics:', analyticsError);
        throw analyticsError;
      }

      // Finally delete the product
      console.log('Deleting the product...');
      const {
        error: productError
      } = await supabase.from('products').delete().eq('id', productId);
      if (productError) {
        console.error('Error deleting product:', productError);
        throw productError;
      }
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted."
      });
      queryClient.invalidateQueries({
        queryKey: ['seller-products']
      });
    } catch (error) {
      console.error('Error in delete operation:', error);
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: "There was an error deleting the product. Please try again."
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-10 md:py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">No products listed yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Get started by listing your first AI product.
            </p>
          </div>
          <div>
            <Link to="/list-product">
              <Button className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity min-h-[44px]">
                List Your First AI SaaS Product
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // For mobile, display cards instead of a table
  if (isMobile) {
    return (
      <TooltipProvider>
        <div className="space-y-3">
          {products.map(product => (
            <Card key={product.id} className="p-4">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">{product.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status || 'Draft'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-1">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Stage:</span>
                    <span className="ml-1">{product.stage}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-1">{formatCurrency(product.price)}</span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleView(product)}
                    className="min-h-[40px]"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="min-h-[40px]"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setProductToDelete(product.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="hover:bg-red-100 hover:text-red-600 transition-colors min-h-[40px]"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <ViewProductDialog 
          product={selectedProduct} 
          isOpen={isViewDialogOpen} 
          onClose={() => {
            setIsViewDialogOpen(false);
            setSelectedProduct(null);
          }} 
        />

        <EditProductDialog 
          product={selectedProduct} 
          isOpen={isEditDialogOpen} 
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedProduct(null);
          }} 
        />

        <DeleteProductDialog 
          isOpen={isDeleteDialogOpen} 
          isDeleting={isDeleting} 
          onClose={() => setIsDeleteDialogOpen(false)} 
          onConfirm={() => productToDelete && handleDelete(productToDelete)} 
        />
      </TooltipProvider>
    );
  }

  // Desktop view - table
  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <ProductTableRow 
                  key={product.id} 
                  product={product} 
                  onView={handleView} 
                  onEdit={handleEdit} 
                  onDelete={(productId) => {
                    setProductToDelete(productId);
                    setIsDeleteDialogOpen(true);
                  }} 
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <ViewProductDialog 
          product={selectedProduct} 
          isOpen={isViewDialogOpen} 
          onClose={() => {
            setIsViewDialogOpen(false);
            setSelectedProduct(null);
          }} 
        />

        <EditProductDialog 
          product={selectedProduct} 
          isOpen={isEditDialogOpen} 
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedProduct(null);
          }} 
        />

        <DeleteProductDialog 
          isOpen={isDeleteDialogOpen} 
          isDeleting={isDeleting} 
          onClose={() => setIsDeleteDialogOpen(false)} 
          onConfirm={() => productToDelete && handleDelete(productToDelete)} 
        />
      </div>
    </TooltipProvider>
  );
}
