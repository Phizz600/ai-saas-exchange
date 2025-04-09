
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Check, X, Eye, ChevronDown, Filter } from "lucide-react";
import { ProductReviewDialog } from "./ProductReviewDialog";
import { sendListingNotification } from "@/integrations/supabase/functions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Product = {
  id: string;
  title: string;
  seller_id: string;
  category: string;
  status: string;
  price: number;
  created_at: string;
  seller?: {
    full_name: string | null;
    first_name: string | null;
    avatar_url: string;
  };
};

export const ProductListingsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('pending');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const query = supabase
        .from('products')
        .select(`
          *,
          seller:profiles(full_name, first_name, avatar_url)
        `);
      
      if (statusFilter) {
        query.eq('status', statusFilter);
      }
      
      query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products for review');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const handleStatusChange = async (productId: string, newStatus: string, feedback?: string) => {
    try {
      // Get the product details before updating
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('title, seller_id')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;
      
      // Update the product status
      const { error } = await supabase
        .from('products')
        .update({ 
          status: newStatus === 'approved' ? 'active' : newStatus, // Set status to 'active' when approved
          admin_feedback: feedback || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', productId);

      if (error) throw error;
      
      // Send email notification based on status change
      try {
        // Get seller email
        const { data: sellerData, error: sellerError } = await supabase
          .from('profiles')
          .select('id, first_name, full_name')
          .eq('id', productData.seller_id)
          .single();
          
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
          productData.seller_id
        );
        
        if (!sellerError && !userError && userData?.user?.email) {
          const sellerFirstName = sellerData?.first_name || sellerData?.full_name?.split(' ')[0] || '';
          
          if (newStatus === 'approved') {
            await sendListingNotification(
              'approved',
              userData.user.email,
              productData.title,
              sellerFirstName,
              '',
              productId
            );
          } else if (newStatus === 'rejected') {
            await sendListingNotification(
              'rejected',
              userData.user.email,
              productData.title,
              sellerFirstName,
              feedback || 'Your listing requires updates before it can be approved.'
            );
          }
        }
      } catch (emailError) {
        console.error("Error sending status notification email:", emailError);
        // Don't fail the status update if email fails
      }
      
      toast.success(`Product ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchProducts();
    } catch (error) {
      console.error(`Error updating product status:`, error);
      toast.error('Failed to update product status');
    }
  };

  const openReviewDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsReviewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {status === 'approved' ? 'Approved' : 'Active'}
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to get seller display name
  const getSellerName = (seller: Product['seller']) => {
    if (!seller) return 'Unknown';
    return seller.full_name || seller.first_name || 'Unknown';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Listings</CardTitle>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter: {statusFilter || 'All'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                Rejected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('')}>
                All Statuses
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No product listings found with status: {statusFilter || 'All'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{getSellerName(product.seller)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>{format(new Date(product.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewDialog(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {product.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusChange(product.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => openReviewDialog(product)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {selectedProduct && (
        <ProductReviewDialog
          product={selectedProduct}
          isOpen={isReviewDialogOpen}
          onClose={() => setIsReviewDialogOpen(false)}
          onApprove={(id) => handleStatusChange(id, 'approved')}
          onReject={(id, feedback) => handleStatusChange(id, 'rejected', feedback)}
        />
      )}
    </Card>
  );
};
