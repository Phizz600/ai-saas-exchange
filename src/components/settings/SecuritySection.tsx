
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VerificationSection } from "./VerificationSection";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function SecuritySection() {
  const [passwords, setPasswords] = useState({ newpw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = async () => {
    setPwLoading(true);
    try {
      if (!passwords.newpw || passwords.newpw !== passwords.confirm) {
        toast({ title: "Passwords do not match", variant: "destructive" });
        setPwLoading(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({
        password: passwords.newpw
      });
      if (error) throw error;
      toast({ title: "Password updated" });
      setPasswords({ newpw: "", confirm: "" });
    } catch (e) {
      toast({ 
        title: "Password update failed", 
        variant: "destructive", 
        description: e?.message 
      });
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await supabase.auth.signOut();
      toast({ 
        title: "Account deleted", 
        description: "Your account has been disabled." 
      });
      window.location.href = "/auth";
    } catch (e) {
      toast({ 
        title: "Account deletion failed", 
        variant: "destructive", 
        description: e?.message 
      });
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <VerificationSection />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-exo">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Input 
              type="password" 
              placeholder="New Password" 
              value={passwords.newpw}
              onChange={e => setPasswords(p => ({ ...p, newpw: e.target.value }))}
              className="bg-white/50"
            />
            <Input 
              type="password" 
              placeholder="Confirm New Password" 
              value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              className="bg-white/50"
            />
          </div>
          <Button 
            onClick={handleChangePassword} 
            disabled={pwLoading}
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
          >
            {pwLoading ? "Updating..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-500 font-exo">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete My Account
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Warning: This action cannot be undone. This will permanently delete your account.
          </p>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogDescription>
            Are you sure? This will permanently disable your account and remove all associated data.
          </DialogDescription>
          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
