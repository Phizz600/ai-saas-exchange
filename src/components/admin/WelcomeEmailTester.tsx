
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export const WelcomeEmailTester = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [userType, setUserType] = useState<"ai_builder" | "ai_investor">("ai_investor");
  const [useCurrentSiteUrl, setUseCurrentSiteUrl] = useState(true);
  const { toast } = useToast();

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Welcome Email Sender</CardTitle>
        <CardDescription>
          Send or schedule a welcome email to a specific email address
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert variant="destructive" className="border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle>Welcome Emails Disabled</AlertTitle>
          <AlertDescription>
            Welcome email functionality has been temporarily disabled while we work on improvements. 
            This feature will be re-enabled in a future update.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="user@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            placeholder="John" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label>User Type</Label>
          <RadioGroup 
            value={userType} 
            onValueChange={(value) => setUserType(value as "ai_builder" | "ai_investor")}
            disabled
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ai_investor" id="ai_investor" disabled />
              <Label htmlFor="ai_investor" className="text-gray-400">AI Investor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ai_builder" id="ai_builder" disabled />
              <Label htmlFor="ai_builder" className="text-gray-400">AI Builder</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="use-current-url" 
            checked={useCurrentSiteUrl}
            onCheckedChange={setUseCurrentSiteUrl}
            disabled
          />
          <Label htmlFor="use-current-url" className="text-gray-400">
            Use current site URL ({window.location.origin}) for email links
          </Label>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex space-x-4 w-full">
          <Button 
            disabled
            className="flex-1 bg-gray-300 text-gray-600 cursor-not-allowed"
          >
            Send Now
          </Button>
          
          <Button 
            disabled
            className="flex-1 bg-gray-300 text-gray-600 cursor-not-allowed"
          >
            Schedule (1 min delay)
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 w-full">
          <p className="mb-1">Note:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Welcome email functionality is currently disabled</li>
            <li>New account signups will not receive welcome emails</li>
            <li>This feature will be re-enabled in a future update</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
};
