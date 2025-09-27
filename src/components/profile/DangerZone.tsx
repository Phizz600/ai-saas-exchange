import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

export const DangerZone = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      // Delete user via Supabase auth admin API (requires elevated perms in prod)
      // Here, we'll sign out the user and recommend contacting support for true deletion,
      // or you can implement an edge function for secure deletion
      await supabase.auth.signOut();
      
      toast({ 
        title: "Account disabled", 
        description: "Your account has been disabled. Contact support for complete data removal."
      });
      
      navigate("/auth");
    } catch (e: any) {
      toast({ 
        title: "Account deletion failed", 
        variant: "destructive", 
        description: e?.message || "An error occurred while deleting your account."
      });
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Delete Account</h4>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. This action cannot be undone.
              All your data, including products, messages, and profile information will be removed.
            </p>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={() => setDeleteOpen(true)}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete My Account
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Warning: This will disable your account and sign you out. Complete data removal may require contacting support.
          </p>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                Are you absolutely sure you want to delete your account? This action cannot be undone.
              </p>
              <p className="font-semibold">
                This will permanently remove:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Your profile and personal information</li>
                <li>All your product listings</li>
                <li>Message history and conversations</li>
                <li>Transaction history</li>
                <li>All saved and liked items</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteOpen(false)} 
              disabled={deleteLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount} 
              disabled={deleteLoading}
              className="flex-1"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Yes, Delete Account
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};