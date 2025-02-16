
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: string;
  title: string;
  price: number;
  status: string;
  seller: {
    full_name: string | null;
  } | null;
  created_at: string;
}

export const PendingProductsTable = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const { data: products, refetch } = useQuery({
    queryKey: ['pending-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          status,
          created_at,
          seller:profiles!products_seller_id_fkey (full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Product interface
      return (data as any[]).map(item => ({
        ...item,
        seller: item.seller ? { full_name: item.seller.full_name } : null
      })) as Product[];
    },
  });

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          status: 'approved',
          admin_feedback: feedback,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', selectedProduct?.id);

      if (error) throw error;

      toast({
        title: "Product Approved",
        description: "The product has been approved and is now live.",
      });

      setIsApproveDialogOpen(false);
      setFeedback("");
      refetch();
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        title: "Error",
        description: "Failed to approve the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!feedback) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback explaining why the product was rejected.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({
          status: 'rejected',
          admin_feedback: feedback,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', selectedProduct?.id);

      if (error) throw error;

      toast({
        title: "Product Rejected",
        description: "The product has been rejected and the seller has been notified.",
      });

      setIsRejectDialogOpen(false);
      setFeedback("");
      refetch();
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast({
        title: "Error",
        description: "Failed to reject the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.seller?.full_name || "Unknown"}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>
                <Badge variant="secondary">{product.status}</Badge>
              </TableCell>
              <TableCell>
                {new Date(product.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsApproveDialogOpen(true);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsRejectDialogOpen(true);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve "{selectedProduct?.title}"?
              You can optionally provide feedback to the seller.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Optional feedback for the seller"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              Approve Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
            <DialogDescription>
              Please provide feedback explaining why "{selectedProduct?.title}" is being rejected.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Required feedback for the seller"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
