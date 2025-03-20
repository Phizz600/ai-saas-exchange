
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
interface UserTypeSelectorProps {
  isBuilder: boolean;
  setIsBuilder: (value: boolean) => void;
  userType: 'ai_builder' | 'ai_investor';
  setUserType: (type: 'ai_builder' | 'ai_investor') => void;
}
export const UserTypeSelector = ({
  isBuilder,
  setIsBuilder,
  userType,
  setUserType
}: UserTypeSelectorProps) => {
  return <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2 bg-black/30 p-4 rounded-lg border border-white/20 shadow-inner">
        <div className="flex items-center space-x-2">
          <Label htmlFor="userType" className="text-white text-base exo-2-heading">I am an</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-white/70 cursor-help hover:text-white transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-900/95 text-white border-gray-700">
                <p className="text-sm max-w-xs">
                  Choose how you'll use the marketplace:
                  <br />- As an Investor to buy AI SaaS businesses
                  <br />- As a Builder to sell AI SaaS businesses
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${userType === 'ai_investor' ? 'text-white font-medium' : 'text-white/60'} transition-colors`}>
              Investor
            </span>
            <Switch id="userType" checked={userType === 'ai_builder'} onCheckedChange={checked => setUserType(checked ? 'ai_builder' : 'ai_investor')} className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${userType === 'ai_builder' ? 'bg-[#8B5CF6]' : 'bg-gradient-to-r from-[#10B981] to-[#34D399]'}`}>
              <span className="block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
            </Switch>
            <span className={`text-sm ${userType === 'ai_builder' ? 'text-white font-medium' : 'text-white/60'} transition-colors`}>
              Builder
            </span>
          </div>
        </div>
      </div>
    </div>;
};
