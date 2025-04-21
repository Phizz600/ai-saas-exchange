
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ProfileSection({ profile }: { profile: any }) {
  const [username, setUsername] = useState(profile?.username || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

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
      toast({ 
        title: "Update failed", 
        variant: "destructive", 
        description: e?.message 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-exo">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Username</label>
            <Input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="bg-white/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <Input 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              className="bg-white/50"
            />
          </div>
        </div>
        <Button 
          onClick={handleSaveProfile} 
          disabled={saving}
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
