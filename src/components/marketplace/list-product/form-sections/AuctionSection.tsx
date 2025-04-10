
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Info, Sparkle, PercentIcon, XCircle } from "lucide-react";
import { format, addDays, addHours } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateValuation, formatCurrency } from "../utils/valuationCalculator";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AuctionSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function AuctionSection({
  form
}: AuctionSectionProps) {
  const [valuation, setValuation] = useState<{
    low: number;
    high: number;
  }>({
    low: 0,
    high: 0
  });
  
  const [reservePriceType, setReservePriceType] = useState<'fixed' | 'percent' | 'none'>('fixed');
  const [recommendedDecrement, setRecommendedDecrement] = useState<number | null>(null);
  
  const monthlyRevenue = form.watch("monthlyRevenue");
  const isAuction = form.watch("isAuction");
  const startingPrice = form.watch("startingPrice");
  const reservePrice = form.watch("reservePrice");
  const auctionDuration = form.watch("auctionDuration");
  
  useEffect(() => {
    // Set default starting price if not set
    if (monthlyRevenue && !form.getValues("startingPrice")) {
      form.setValue("startingPrice", monthlyRevenue * 10);
    }
    
    // Set default auction duration if not set
    if (isAuction && !form.getValues("auctionDuration")) {
      form.setValue("auctionDuration", "7");
    }
    
    // Set default auction end time if not set
    if (isAuction && !form.getValues("auctionEndTime") && form.getValues("auctionDuration")) {
      const duration = parseInt(form.getValues("auctionDuration") || "7");
      const endTime = addDays(new Date(), duration);
      form.setValue("auctionEndTime", endTime);
    }
  }, [monthlyRevenue, isAuction, form]);
  
  // Calculate recommended price decrement based on starting price and reserve price
  useEffect(() => {
    if (startingPrice && reservePrice && auctionDuration) {
      const duration = parseInt(auctionDuration);
      const priceDifference = startingPrice - reservePrice;
      
      // Calculate recommended decrement based on auction duration
      // For longer auctions, we want fewer decrements per day
      let decrementInterval: string;
      let decrementCount: number;
      
      if (duration <= 3) {
        // For short auctions (1-3 days), decrement hourly
        decrementInterval = 'hour';
        decrementCount = duration * 24; // hours in the duration
      } else if (duration <= 14) {
        // For medium auctions (4-14 days), decrement every 6 hours
        decrementInterval = 'hour';
        decrementCount = duration * 4; // 4 decrements per day
      } else {
        // For long auctions (more than 14 days), decrement daily
        decrementInterval = 'day';
        decrementCount = duration;
      }
      
      // Calculate the recommended decrement amount
      const recommendedAmount = Math.ceil(priceDifference / decrementCount);
      
      setRecommendedDecrement(recommendedAmount > 0 ? recommendedAmount : null);
      
      // Update the form with the recommended values if not already set
      if (!form.getValues("priceDecrementInterval")) {
        form.setValue("priceDecrementInterval", decrementInterval);
      }
      
      if (!form.getValues("priceDecrement") && recommendedAmount > 0) {
        form.setValue("priceDecrement", recommendedAmount);
      }
    } else {
      setRecommendedDecrement(null);
    }
  }, [startingPrice, reservePrice, auctionDuration, form]);
  
  // Update reserve price based on type selection
  useEffect(() => {
    if (reservePriceType === 'percent' && startingPrice) {
      const percentValue = form.getValues("reservePricePercent") || 70;
      const calculatedReservePrice = Math.round(startingPrice * (percentValue / 100));
      form.setValue("reservePrice", calculatedReservePrice);
    } else if (reservePriceType === 'none') {
      form.setValue("reservePrice", 1); // Minimum possible value
    }
  }, [reservePriceType, startingPrice, form]);
  
  // Handle reserve price percent change
  const handleReservePricePercentChange = (percent: number) => {
    form.setValue("reservePricePercent", percent);
    if (startingPrice) {
      const calculatedReservePrice = Math.round(startingPrice * (percent / 100));
      form.setValue("reservePrice", calculatedReservePrice);
    }
  };
  
  // Handle auction duration change
  const handleAuctionDurationChange = (duration: string) => {
    form.setValue("auctionDuration", duration);
    
    // Update auction end time based on duration
    const durationDays = parseInt(duration);
    if (!isNaN(durationDays)) {
      const endTime = addDays(new Date(), durationDays);
      form.setValue("auctionEndTime", endTime);
    }
  };
  
  const watchMonthlyRevenue = form.watch("monthlyRevenue") || 0;
  const watchMonthlyChurnRate = form.watch("monthlyChurnRate") || 0;
  const watchGrossProfitMargin = (form.watch("grossProfitMargin") || 0) / 100;
  const watchIndustry = form.watch("industry") || "";
  const watchHasPatents = form.watch("hasPatents") || false;
  const watchCustomerAcquisitionCost = form.watch("customerAcquisitionCost");
  
  const formatCurrencyInput = (value: string) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
      numericValue = parts[0] + '.' + parts[1].slice(0, 2);
    }
    if (numericValue) {
      const number = parseFloat(numericValue);
      if (!isNaN(number)) {
        return `$${number.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })}`;
      }
    }
    return '';
  };
  
  const parseCurrencyValue = (value: string) => {
    const numericValue = parseFloat(value.replace(/[$,]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };
  
  const handleValuationClick = (e: React.MouseEvent, value: number, isHigh: boolean) => {
    e.preventDefault();
    if (isAuction) {
      if (isHigh) {
        form.setValue("startingPrice", value);
      } else {
        form.setValue("reservePrice", value);
      }
    } else {
      form.setValue("price", value);
    }
  };
  
  useEffect(() => {
    const updateValuation = async () => {
      const newValuation = await calculateValuation(watchMonthlyRevenue, watchMonthlyChurnRate / 100, watchGrossProfitMargin, watchIndustry, watchHasPatents, undefined, undefined, watchCustomerAcquisitionCost);
      setValuation(newValuation);
    };
    updateValuation();
  }, [watchMonthlyRevenue, watchMonthlyChurnRate, watchGrossProfitMargin, watchIndustry, watchHasPatents, watchCustomerAcquisitionCost]);

  // Helper function to get the display text for price decrement interval
  const getDecrementIntervalLabel = (interval: string) => {
    switch (interval) {
      case "minute": return "Per Minute";
      case "hour": return "Per Hour";
      case "day": return "Per Day";
      case "week": return "Per Week";
      case "month": return "Per Month";
      default: return "Select interval";
    }
  };
  
  // Get auction duration options
  const getDurationOptions = () => {
    return [
      { value: "1", label: "1 Day" },
      { value: "3", label: "3 Days" },
      { value: "5", label: "5 Days" },
      { value: "7", label: "7 Days" },
      { value: "10", label: "10 Days" },
      { value: "14", label: "14 Days" },
      { value: "21", label: "21 Days" },
      { value: "30", label: "30 Days" }
    ];
  };

  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${!isAuction ? "text-primary" : "text-gray-500"}`}>Fixed Price</span>
          <FormField control={form.control} name="isAuction" render={({
          field
        }) => <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>} />
          <span className={`text-sm ${isAuction ? "text-primary" : "text-gray-500"}`}>Dutch Auction</span>
        </div>
      </div>
      
      {isAuction ? <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="startingPrice" render={({
          field
        }) => <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Starting Price (USD)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white">
                          <p>Starting price for your Dutch auction. Price drops until sold or reaching reserve price.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter starting price" value={formatCurrencyInput(field.value?.toString() || '')} onChange={e => {
              const value = parseCurrencyValue(e.target.value);
              field.onChange(value > 0 ? value : undefined);
            }} className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="auctionDuration" render={({
          field
        }) => <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Auction Duration
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white">
                          <p>How long your auction will run before ending automatically</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Select onValueChange={handleAuctionDurationChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getDurationOptions().map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
          </div>
          
          {/* Reserve Price Settings */}
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="text-sm font-medium mb-3">Reserve Price Settings</h3>
            
            <RadioGroup defaultValue="fixed" className="mb-4" onValueChange={(value) => setReservePriceType(value as 'fixed' | 'percent' | 'none')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed Amount</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percent" id="percent" />
                <Label htmlFor="percent">Percentage of Starting Price</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">No Reserve (Allow Any Price)</Label>
              </div>
            </RadioGroup>
            
            {reservePriceType === 'fixed' && (
              <FormField control={form.control} name="reservePrice" render={({
                field
              }) => <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Reserve Price (USD)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white">
                        <p>The lowest price you're willing to accept. The auction will stop at this price.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter reserve price" value={formatCurrencyInput(field.value?.toString() || '')} onChange={e => {
                    const value = parseCurrencyValue(e.target.value);
                    field.onChange(value > 0 ? value : undefined);
                  }} className="font-mono" />
                </FormControl>
                <FormMessage />
              </FormItem>} />
            )}
            
            {reservePriceType === 'percent' && (
              <div className="space-y-3">
                <FormField control={form.control} name="reservePricePercent" render={({
                  field
                }) => <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Reserve Price Percentage
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white">
                          <p>Set reserve price as a percentage of starting price</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input 
                        type="number" 
                        min="1" 
                        max="99" 
                        value={field.value || 70} 
                        onChange={e => handleReservePricePercentChange(parseInt(e.target.value))} 
                        className="w-24 mr-2" 
                      />
                      <PercentIcon className="h-4 w-4 text-gray-500" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
                
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span>Calculated reserve price:</span> 
                  <span className="font-medium">{formatCurrency(form.getValues("reservePrice") || 0)}</span>
                </div>
              </div>
            )}
            
            {reservePriceType === 'none' && (
              <div className="bg-amber-50 p-3 rounded border border-amber-200 text-amber-800 text-sm">
                <p className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Your auction will run with no reserve price. The item will sell to the highest bidder regardless of price.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="priceDecrement" render={({
          field
        }) => <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Price Decrement (USD)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white">
                          <p>How much the price will decrease per selected time interval until reaching the reserve price</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input type="text" placeholder="Enter price decrement" value={formatCurrencyInput(field.value?.toString() || '')} onChange={e => {
                const value = parseCurrencyValue(e.target.value);
                field.onChange(value > 0 ? value : undefined);
              }} className="font-mono" />
                      
                      {/* Recommended decrement display */}
                      {recommendedDecrement && (
                        <div className="mt-1.5 flex items-center text-sm text-green-600">
                          <button 
                            type="button" 
                            className="underline flex items-center" 
                            onClick={() => field.onChange(recommendedDecrement)}
                          >
                            Recommended: {formatCurrency(recommendedDecrement)}
                          </button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="priceDecrementInterval" render={({
          field
        }) => <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Decrement Interval
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white">
                          <p>How often the price should decrease</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval">
                          {field.value ? getDecrementIntervalLabel(field.value) : "Select interval"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="minute">Per Minute</SelectItem>
                      <SelectItem value="hour">Per Hour</SelectItem>
                      <SelectItem value="day">Per Day</SelectItem>
                      <SelectItem value="week">Per Week</SelectItem>
                      <SelectItem value="month">Per Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Auction End Time - Hidden but populated automatically based on duration */}
          <FormField 
            control={form.control} 
            name="auctionEndTime" 
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" />
                </FormControl>
              </FormItem>
            )} 
          />
        </div> : <div className="space-y-4">
          <FormField control={form.control} name="price" render={({
        field
      }) => <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Fixed Price (USD)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white">
                        <p>Set a fixed price for your product</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter price" value={formatCurrencyInput(field.value?.toString() || '')} onChange={e => {
            const value = parseCurrencyValue(e.target.value);
            field.onChange(value > 0 ? value : undefined);
          }} className="font-mono" />
                </FormControl>
                <FormMessage />
              </FormItem>} />
        </div>}

      <Card className="p-6 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white">
        <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
          <Sparkle className="h-5 w-5" />
          AI-Powered Valuation Range
        </h3>
        <div className="text-2xl font-bold flex items-center justify-center gap-4">
          <button type="button" onClick={e => handleValuationClick(e, valuation.low, false)} className="hover:opacity-80 transition-opacity">
            {formatCurrency(valuation.low)}
          </button>
          <span>-</span>
          <button type="button" onClick={e => handleValuationClick(e, valuation.high, true)} className="hover:opacity-80 transition-opacity">
            {formatCurrency(valuation.high)}
          </button>
        </div>
        <p className="text-sm mt-2 text-white/80">
          This AI-powered valuation is based on your monthly revenue, churn rate, profit margins, customer acquisition costs, and other factors.
          Our machine learning model analyzes these metrics to provide a customized valuation range.
          Click on either value to use it as your {isAuction ? "auction prices" : "fixed price"}.
        </p>
      </Card>
    </div>;
}
