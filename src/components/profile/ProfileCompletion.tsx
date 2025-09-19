import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Check, X } from "lucide-react";

interface ProfileCompletionProps {
  progress: number;
  userType: string | null;
}

export const ProfileCompletion = ({ progress, userType }: ProfileCompletionProps) => {
  const steps = [
    "Upload profile picture",
    "Complete bio section", 
    "Verify email address",
    "Add professional details",
    "Connect social profiles"
  ];
  
  // Calculate how many steps should be completed based on progress
  const completedSteps = Math.floor((progress / 100) * steps.length);

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
            Complete your profile to increase visibility and trust with potential {userType === "ai_builder" ? "buyers" : "sellers"}.
          </p>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {progress === 100 ? 'Completed steps:' : 'Steps to complete:'}
            </h4>
            <ul className="space-y-1 text-xs">
              {steps.map((step, index) => {
                const isCompleted = index < completedSteps;
                return (
                  <li key={step} className="flex items-center gap-2">
                    {isCompleted ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <X className="w-3 h-3 text-red-500" />
                    )}
                    <span className={isCompleted ? "text-green-600" : "text-muted-foreground"}>
                      {step}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};