
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LockIcon } from "lucide-react";
import { NdaDialog } from "./NdaDialog";

interface NdaButtonProps {
  productId: string;
  productTitle: string;
  ndaContent?: string;
  onSignSuccess: () => void;
}

export function NdaButton({ productId, productTitle, ndaContent, onSignSuccess }: NdaButtonProps) {
  const [isNdaDialogOpen, setIsNdaDialogOpen] = useState(false);

  return (
    <Dialog open={isNdaDialogOpen} onOpenChange={setIsNdaDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-medium shadow-md"
        >
          <LockIcon className="h-4 w-4 mr-2" />
          Sign NDA to View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <NdaDialog
          productId={productId}
          productTitle={productTitle}
          ndaContent={ndaContent || ""}
          onClose={() => setIsNdaDialogOpen(false)}
          onSuccess={onSignSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
