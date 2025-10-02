import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Shield, Key } from "lucide-react";
export const PasswordSettings = () => {
  const {
    toast
  } = useToast();
  const [passwords, setPasswords] = useState({
    newpw: "",
    confirm: ""
  });
  const [loading, setLoading] = useState(false);
  const handleChangePassword = async () => {
    setLoading(true);
    try {
      if (!passwords.newpw || passwords.newpw !== passwords.confirm) {
        toast({
          title: "Passwords do not match",
          variant: "destructive",
          description: "Please ensure both password fields match."
        });
        setLoading(false);
        return;
      }
      if (passwords.newpw.length < 6) {
        toast({
          title: "Password too short",
          variant: "destructive",
          description: "Password must be at least 6 characters long."
        });
        setLoading(false);
        return;
      }
      const {
        error
      } = await supabase.auth.updateUser({
        password: passwords.newpw
      });
      if (error) throw error;
      toast({
        title: "Password updated successfully"
      });
      setPasswords({
        newpw: "",
        confirm: ""
      });
    } catch (e: any) {
      toast({
        title: "Password update failed",
        variant: "destructive",
        description: e?.message || "An error occurred while updating your password."
      });
    } finally {
      setLoading(false);
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" placeholder="Enter new password" value={passwords.newpw} onChange={e => setPasswords(p => ({
          ...p,
          newpw: e.target.value
        }))} minLength={6} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" placeholder="Confirm new password" value={passwords.confirm} onChange={e => setPasswords(p => ({
          ...p,
          confirm: e.target.value
        }))} minLength={6} />
        </div>
        
        <Button onClick={handleChangePassword} disabled={loading || !passwords.newpw || !passwords.confirm} className="w-full text-stone-50 bg-black">
          {loading ? <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </> : <>
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </>}
        </Button>
        
        <p className="text-sm text-muted-foreground">
          You may need to log in again after changing your password.
        </p>
      </CardContent>
    </Card>;
};