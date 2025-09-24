import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  stage: string;
  status?: string;
}
interface ViewProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}
export function ViewProductDialog({
  product,
  isOpen,
  onClose
}: ViewProductDialogProps) {
  if (!product) return null;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Listing Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Title</h4>
            <p className="text-sm text-gray-500">{product.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Category</h4>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Stage</h4>
            <p className="text-sm text-gray-500">{product.stage}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Price</h4>
            <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Status</h4>
            <p className="text-sm text-gray-500">{product.status || 'Draft'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}