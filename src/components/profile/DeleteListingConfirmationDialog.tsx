import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface DeleteListingConfirmationDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  listingTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteListingConfirmationDialog({ 
  isOpen, 
  isDeleting, 
  listingTitle, 
  onClose, 
  onConfirm 
}: DeleteListingConfirmationDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmationValid = confirmationText === "DELETE PERMANENTLY";

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Listing Permanently
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              You are about to permanently delete <strong>"{listingTitle}"</strong>. 
              This action cannot be undone.
            </p>
            <p className="text-destructive font-medium">
              This will also delete all related data including bids, offers, analytics, and notifications.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              To confirm deletion, type <strong>DELETE PERMANENTLY</strong> below:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE PERMANENTLY"
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}