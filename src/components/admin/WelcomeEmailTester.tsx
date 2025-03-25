
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendWelcomeEmail } from "@/integrations/supabase/functions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const WelcomeEmailTester = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [userType, setUserType] = useState<"ai_builder" | "ai_investor">("ai_investor");
  const { toast } = useToast();

  const handleSendWelcomeEmail = async () => {
    if (!email || !firstName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter an email address and first name",
      });
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log(`Sending welcome email to ${email} (${userType})`);
      const response = await sendWelcomeEmail(email, firstName, userType);
      
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

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Send Welcome Email</CardTitle>
        <CardDescription>
          Send a welcome email to a specific email address
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
              <p>Welcome email sent successfully!</p>
              <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-xs overflow-auto max-h-40">
                <pre>{JSON.stringify(success, null, 2)}</pre>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSendWelcomeEmail} 
          disabled={isSending}
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Welcome Email"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
