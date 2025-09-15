
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { EmailVerificationBanner } from "@/components/profile/EmailVerificationBanner";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailPrefs, setEmailPrefs] = useState({ newsletter: false, updates: false });
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newpw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Load the profile and auth user
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        navigate("/auth");
        return;
      }
      // Load Profile
      const { data: profileData, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profErr || !profileData) {
        toast({ variant: "destructive", title: "Error", description: "Could not load profile." });
        setLoading(false);
        return;
      }
      setProfile(profileData);
      setUsername(profileData.username || "");
      setFullName(profileData.full_name || "");
      // You can load real email prefs from a table in future, here just fake
      setEmailPrefs({ newsletter: false, updates: false });
      setLoading(false);
    })();
  }, [navigate, toast]);

  // Username/fullName save
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username, full_name: fullName })
        .eq("id", profile.id);

      if (error) throw error;
      toast({ title: "Profile updated!" });
    } catch (e) {
      toast({ title: "Update failed", variant: "destructive", description: e?.message });
    } finally {
      setSaving(false);
    }
  };

  // Password change flow
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
      setPasswords({ current: "", newpw: "", confirm: "" });
    } catch (e) {
      toast({ title: "Password update failed", variant: "destructive", description: e?.message });
    } finally {
      setPwLoading(false);
    }
  };

  // Delete account flow
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      // Delete user via Supabase auth admin API (requires elevated perms in prod)
      // Here, we'll sign out the user and recommend contacting support for true deletion,
      // or you can implement an edge function for secure deletion
      await supabase.auth.signOut();
      toast({ title: "Account deleted", description: "Your account has been disabled." });
      navigate("/auth");
    } catch (e) {
      toast({ title: "Account deletion failed", variant: "destructive", description: e?.message });
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  // Dummy email pref updating handler (expand as needed)
  const handleEmailPrefs = () => {
    toast({ title: "Preferences updated", description: "Email preferences saved (not functional)" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Email Verification Banner */}
        <EmailVerificationBanner />

        {/* Enhanced Profile Edit Form */}
        {profile && (
          <EditProfileForm 
            profile={profile} 
            onProfileUpdate={(updatedProfile) => setProfile(updatedProfile)}
          />
        )}

        {/* Legacy Username Section (keeping for backward compatibility) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-exo">Username Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <Input value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <Button className="mt-2" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Username"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-exo">Email Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium">Newsletters</label>
              <input 
                type="checkbox" 
                checked={emailPrefs.newsletter}
                onChange={e => setEmailPrefs(p => ({ ...p, newsletter: e.target.checked }))}
              />
            </div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium">Product Updates</label>
              <input 
                type="checkbox" 
                checked={emailPrefs.updates}
                onChange={e => setEmailPrefs(p => ({ ...p, updates: e.target.checked }))}
              />
            </div>
            <Button variant="outline" onClick={handleEmailPrefs}>Save Preferences</Button>
            <div className="text-xs text-gray-400 mt-2">* Email preferences updating is a placeholder for now</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-exo">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input type="password" placeholder="New Password" value={passwords.newpw}
              onChange={e => setPasswords(p => ({ ...p, newpw: e.target.value }))} />
            <Input type="password" placeholder="Confirm New Password" value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
            <Button onClick={handleChangePassword} disabled={pwLoading}>
              {pwLoading ? "Updating..." : "Change Password"}
            </Button>
            <div className="text-xs text-gray-400">* Log in again if you do not receive a password change email</div>
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
            <div className="text-xs text-gray-400 mt-2">
              Warning: This will disable your account and sign you out. Full account deletion may need to be requested via support.
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogDescription>
            Are you sure? This will permanently disable your account and remove profile data.
          </DialogDescription>
          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
