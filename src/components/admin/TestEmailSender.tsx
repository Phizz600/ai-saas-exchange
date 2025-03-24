
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const TestEmailSender = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendTestEmail = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-test-email');
      
      if (error) {
        console.error("Error sending test email:", error);
        toast({
          variant: "destructive",
          title: "Failed to send email",
          description: error.message || "An unexpected error occurred",
        });
        return;
      }
      
      toast({
        title: "Test email sent!",
        description: `Email sent to ${data.to} (${data.firstName}, ${data.userType})`,
      });
      
      console.log("Email send response:", data);
    } catch (err) {
      console.error("Error in test email function:", err);
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="font-semibold mb-4 text-lg">Send Test Email</h2>
      <p className="text-gray-600 mb-4">
        This will send a welcome email to the most recent user who signed up.
      </p>
      <Button 
        onClick={sendTestEmail} 
        disabled={isSending}
        className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
      >
        {isSending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Test Email"
        )}
      </Button>
    </div>
  );
};
