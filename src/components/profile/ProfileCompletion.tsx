import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Check, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileCompletionProps {
  profile: Profile;
}

export const ProfileCompletion = ({ profile }: ProfileCompletionProps) => {
  const steps = [
    { name: "Upload profile picture", completed: !!profile.avatar_url },
    { name: "Complete bio section", completed: !!profile.bio },
    { name: "Verify email address", completed: true } // Always true if user can access profile
  ];
  
  // Calculate actual progress based on completed steps
  const completedCount = steps.filter(step => step.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className="animate-fade-in bg-gradient-to-r from-[#D946EE]/5 via-[#8B5CF6]/5 to-[#0EA4E9]/5">
      <CardHeader>
        <CardTitle className="text-lg font-exo flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#D946EE]" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-3 bg-gray-200"
            />
            <div 
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{progress}% Complete</span>
            <span className="text-xs text-muted-foreground">
              {progress === 100 ? '🎉 Perfect!' : `${100 - progress}% to go`}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete your profile to increase visibility and trust with potential {profile.user_type === "ai_builder" ? "buyers" : "sellers"}.
          </p>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {progress === 100 ? 'Completed steps:' : 'Steps to complete:'}
            </h4>
            <ul className="space-y-1 text-xs">
              {steps.map((step) => (
                <li key={step.name} className="flex items-center gap-2">
                  {step.completed ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <X className="w-3 h-3 text-red-500" />
                  )}
                  <span className={step.completed ? "text-green-600" : "text-muted-foreground"}>
                    {step.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};