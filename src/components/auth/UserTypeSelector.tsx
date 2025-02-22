
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserTypeSelectorProps {
  isBuilder: boolean;
  setIsBuilder: (value: boolean) => void;
  userType: 'ai_builder' | 'ai_investor';
  setUserType: (type: 'ai_builder' | 'ai_investor') => void;
}

export const UserTypeSelector = ({ isBuilder, setIsBuilder, userType, setUserType }: UserTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <Label htmlFor="userType" className="font-exo">I am a</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-gray-400 hover:text-gray-600">?</span>
              </TooltipTrigger>
              <TooltipContent className="bg-white p-4 max-w-xs">
                <p className="text-sm text-gray-600">
                  Choose how you'll use the marketplace:
                  <br />- As an Investor to buy AI products
                  <br />- As a Builder to sell AI products
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${userType === 'ai_investor' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              Investor
            </span>
            <Switch
              id="userType"
              checked={userType === 'ai_builder'}
              onCheckedChange={(checked) => setUserType(checked ? 'ai_builder' : 'ai_investor')}
              className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                userType === 'ai_builder'
                  ? 'bg-[#8B5CF6]'
                  : 'bg-gradient-to-r from-[#10B981] to-[#34D399]'
              }`}
            >
              <span className="block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
            </Switch>
            <span className={`text-sm ${userType === 'ai_builder' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              Builder
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
