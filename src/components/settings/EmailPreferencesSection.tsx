
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailPreferences {
  newsletter: boolean;
  product_updates: boolean;
  transaction_notifications: boolean;
  marketing_emails: boolean;
}

export function EmailPreferencesSection() {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    newsletter: false,
    product_updates: false,
    transaction_notifications: true,
    marketing_emails: false
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: prefs, error } = await supabase
        .from('email_preferences')
        .select('*')
        .single();

      if (error) throw error;
      if (prefs) {
        setPreferences({
          newsletter: prefs.newsletter,
          product_updates: prefs.product_updates,
          transaction_notifications: prefs.transaction_notifications,
          marketing_emails: prefs.marketing_emails
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('email_preferences')
        .upsert({ 
          ...preferences,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      toast({ title: "Email preferences saved!" });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({ 
        title: "Error saving preferences", 
        variant: "destructive",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-exo">Email Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="newsletter">Newsletters</Label>
          <Switch 
            id="newsletter"
            checked={preferences.newsletter}
            onCheckedChange={checked => setPreferences(p => ({ ...p, newsletter: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="product_updates">Product Updates</Label>
          <Switch 
            id="product_updates"
            checked={preferences.product_updates}
            onCheckedChange={checked => setPreferences(p => ({ ...p, product_updates: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="transaction_notifications">Transaction Notifications</Label>
          <Switch 
            id="transaction_notifications"
            checked={preferences.transaction_notifications}
            onCheckedChange={checked => setPreferences(p => ({ ...p, transaction_notifications: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="marketing_emails">Marketing Emails</Label>
          <Switch 
            id="marketing_emails"
            checked={preferences.marketing_emails}
            onCheckedChange={checked => setPreferences(p => ({ ...p, marketing_emails: checked }))}
          />
        </div>
        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
