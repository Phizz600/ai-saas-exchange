
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FinancialSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

const MONETIZATION_OPTIONS = [
  'subscription',
  'pay_per_use',
  'freemium',
  'one_time_purchase',
  'usage_based',
  'tiered_pricing',
  'enterprise_licensing',
  'marketplace_commission',
  'advertising',
  'data_monetization',
  'affiliate',
  'other'
] as const;

export function FinancialSection({ form }: FinancialSectionProps) {
  const showMonetizationOther = form.watch('monetization') === 'other';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Financials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="monthlyRevenue"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                MRR (Monthly Recurring Revenue)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Monthly recurring revenue from your AI product</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter MRR in USD"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monetization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Monetization Strategy
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>How do you monetize your AI product?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select monetization strategy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="item-aligned" className="bg-white">
                  {MONETIZATION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showMonetizationOther && (
          <FormField
            control={form.control}
            name="monetizationOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Monetization Strategy</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Describe your monetization strategy"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="monthlyProfit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Monthly Profit
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Net profit generated monthly after all expenses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter monthly profit in USD"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grossProfitMargin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Gross Profit Margin (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Percentage of revenue that remains after direct costs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter profit margin"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthlyChurnRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Monthly Churn Rate (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Percentage of customers that stop using your product each month</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter churn rate"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerAcquisitionCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Customer Acquisition Cost (CAC)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Average cost to acquire a single customer, including marketing and sales expenses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter CAC in USD"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
