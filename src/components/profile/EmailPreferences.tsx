import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Bell } from "lucide-react";
export const EmailPreferences = () => {
  const {
    toast
  } = useToast();
  const [emailPrefs, setEmailPrefs] = useState({
    newsletter: false,
    updates: false,
    marketing: false,
    security: true
  });
  const handleEmailPrefs = () => {
    // This is a placeholder - in a real app you'd save these to a database
    toast({
      title: "Preferences updated",
      description: "Your email preferences have been saved."
    });
  };
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Newsletter</Label>
              <p className="text-sm text-muted-foreground">
                Receive our weekly newsletter with AI industry updates
              </p>
            </div>
            <Switch checked={emailPrefs.newsletter} onCheckedChange={checked => setEmailPrefs(p => ({
            ...p,
            newsletter: checked
          }))} />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Product Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new features and improvements
              </p>
            </div>
            <Switch checked={emailPrefs.updates} onCheckedChange={checked => setEmailPrefs(p => ({
            ...p,
            updates: checked
          }))} />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Marketing Communications</Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional emails and special offers
              </p>
            </div>
            <Switch checked={emailPrefs.marketing} onCheckedChange={checked => setEmailPrefs(p => ({
            ...p,
            marketing: checked
          }))} />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Security Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Important account security alerts (recommended)
              </p>
            </div>
            <Switch checked={emailPrefs.security} onCheckedChange={checked => setEmailPrefs(p => ({
            ...p,
            security: checked
          }))} />
          </div>
        </div>
        
        <Button onClick={handleEmailPrefs} className="w-full bg-black">
          <Bell className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Note: Email preferences are currently in development. Changes will be saved for future implementation.
        </p>
      </CardContent>
    </Card>;
};