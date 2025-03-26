
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type Product = {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  price: number;
  image_url?: string;
  tech_stack?: string[];
  monetization?: string;
  monthly_revenue?: number;
  monthly_traffic?: number;
  stage?: string;
  created_at: string;
  seller?: {
    full_name: string | null;
    first_name: string | null;
    avatar_url: string;
  };
};

interface ProductReviewDialogProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, feedback: string) => void;
}

export function ProductReviewDialog({
  product,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ProductReviewDialogProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = () => {
    setIsSubmitting(true);
    onApprove(product.id);
    setFeedback(""); // Reset feedback after submission
    setIsSubmitting(false);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      alert("Please provide feedback when rejecting a product");
      return;
    }
    setIsSubmitting(true);
    onReject(product.id, feedback);
    setFeedback(""); // Reset feedback after submission
    setIsSubmitting(false);
  };

  // Helper function to get seller display name
  const getSellerName = () => {
    if (!product.seller) return "Unknown Seller";
    return product.seller.full_name || product.seller.first_name || "Unknown Seller";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Product Listing</DialogTitle>
          <DialogDescription>
            Review the details of this product listing before approving or rejecting it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-start gap-4">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-36 h-36 object-cover rounded-md"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-gray-100">
                  {product.category}
                </Badge>
                {product.stage && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {product.stage}
                  </Badge>
                )}
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ${product.price.toLocaleString()}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Submitted on {format(new Date(product.created_at), "MMM d, yyyy")} by{" "}
                {getSellerName()}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-700">{product.description || "No description provided"}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Technology</h4>
              <div className="space-y-2">
                {product.tech_stack && product.tech_stack.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {product.tech_stack.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No technology stack specified</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Monetization</h4>
              <p>{product.monetization || "Not specified"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Monthly Revenue</h4>
              <p>
                {product.monthly_revenue ? `$${product.monthly_revenue.toLocaleString()}` : "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Monthly Traffic</h4>
              <p>
                {product.monthly_traffic ? `${product.monthly_traffic.toLocaleString()} visitors` : "Not specified"}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Feedback for Seller</h4>
            <Textarea
              placeholder="Provide feedback on why you're rejecting this listing (required for rejection)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              Reject Listing
            </Button>
            <Button
              type="button"
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600"
            >
              Approve Listing
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
