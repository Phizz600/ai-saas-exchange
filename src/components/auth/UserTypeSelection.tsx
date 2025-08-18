import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type UserType = "ai_builder" | "ai_investor";

export const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState<UserType>("ai_builder");

  const handleUserTypeSubmit = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      
      console.log("User type updated successfully");
      navigate("/onboarding-redirect");
    } catch (error) {
      console.error("Error updating user type:", error);
      setErrorMessage("Failed to update user type. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">What best describes you?</h2>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <RadioGroup
        value={userType}
        onValueChange={(value) => setUserType(value as UserType)}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ai_builder" id="ai_builder" />
          <Label htmlFor="ai_builder">AI Builder</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ai_investor" id="ai_investor" />
          <Label htmlFor="ai_investor">AI Investor</Label>
        </div>
      </RadioGroup>
      <button
        onClick={handleUserTypeSubmit}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
      >
        Continue
      </button>
    </div>
  );
};