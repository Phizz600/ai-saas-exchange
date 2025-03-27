
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendWelcomeEmail, scheduleWelcomeEmail } from "@/integrations/supabase/functions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export const WelcomeEmailTester = () => {
  const [isSending, setIsSending] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [userType, setUserType] = useState<"ai_builder" | "ai_investor">("ai_investor");
  const [useCurrentSiteUrl, setUseCurrentSiteUrl] = useState(true);
  const { toast } = useToast();

  const validateInputs = () => {
    if (!email || !firstName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter an email address and first name",
      });
      return false;
    }
    return true;
  };

  const handleSendWelcomeEmail = async () => {
    if (!validateInputs()) return;

    setIsSending(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log(`Sending welcome email to ${email} (${userType})`);
      const siteUrl = useCurrentSiteUrl ? window.location.origin : undefined;
      const response = await sendWelcomeEmail(email, firstName, userType, siteUrl);
      
      console.log("Welcome email response:", response);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setSuccess(response);
      
      toast({
        title: "Welcome email sent!",
        description: `Email sent to ${email}`,
      });
    } catch (err: any) {
      console.error("Error sending welcome email:", err);
      const errorMessage = err?.message || "An unexpected error occurred";
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Failed to send welcome email",
        description: errorMessage,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleScheduleWelcomeEmail = async () => {
    if (!validateInputs()) return;

    setIsScheduling(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log(`Scheduling welcome email to ${email} (${userType})`);
      const siteUrl = useCurrentSiteUrl ? window.location.origin : undefined;
      const response = await scheduleWelcomeEmail(email, firstName, userType, siteUrl);
      
      console.log("Schedule welcome email response:", response);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setSuccess(response);
      
      toast({
        title: "Welcome email scheduled!",
        description: `Email will be sent to ${email} in 1 minute`,
      });
    } catch (err: any) {
      console.error("Error scheduling welcome email:", err);
      const errorMessage = err?.message || "An unexpected error occurred";
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Failed to schedule welcome email",
        description: errorMessage,
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Welcome Email Sender</CardTitle>
        <CardDescription>
          Send or schedule a welcome email to a specific email address
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="user@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            placeholder="John" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>User Type</Label>
          <RadioGroup 
            value={userType} 
            onValueChange={(value) => setUserType(value as "ai_builder" | "ai_investor")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ai_investor" id="ai_investor" />
              <Label htmlFor="ai_investor">AI Investor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ai_builder" id="ai_builder" />
              <Label htmlFor="ai_builder">AI Builder</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="use-current-url" 
            checked={useCurrentSiteUrl}
            onCheckedChange={setUseCurrentSiteUrl}
          />
          <Label htmlFor="use-current-url">
            Use current site URL ({window.location.origin}) for email links
          </Label>
        </div>
        
        {!useCurrentSiteUrl && (
          <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
            <p className="text-amber-700 text-sm">
              Using production URL (https://aiexchange.club) for email links.
            </p>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-700">Success</AlertTitle>
            <AlertDescription className="text-green-600">
              <p>{success.message || "Operation completed successfully!"}</p>
              <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-xs overflow-auto max-h-40">
                <pre>{JSON.stringify(success, null, 2)}</pre>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex space-x-4 w-full">
          <Button 
            onClick={handleSendWelcomeEmail} 
            disabled={isSending || isScheduling}
            className="flex-1 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Now"
            )}
          </Button>
          
          <Button 
            onClick={handleScheduleWelcomeEmail} 
            disabled={isSending || isScheduling}
            className="flex-1 bg-[#8B5CF6] text-white"
          >
            {isScheduling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule (1 min delay)"
            )}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 w-full">
          <p className="mb-1">Note:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>The "Send Now" option delivers the email immediately</li>
            <li>The "Schedule" option will send the email after a 1-minute delay</li>
            <li>New user signups automatically receive a scheduled welcome email with a 1-minute delay</li>
            <li>Email links will use {useCurrentSiteUrl ? window.location.origin : 'https://aiexchange.club'} as the base URL</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
};
