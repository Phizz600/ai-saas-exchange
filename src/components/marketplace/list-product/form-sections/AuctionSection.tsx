
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Info, Sparkle, Clock } from "lucide-react";
import { format, addDays, addHours } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateValuation, formatCurrency } from "../utils/valuationCalculator";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

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
  const [recommendedDecrement, setRecommendedDecrement] = useState<number>(0);
  
  const monthlyRevenue = form.watch("monthlyRevenue");
  const isAuction = form.watch("isAuction");
  const startingPrice = form.watch("startingPrice");
  const reservePrice = form.watch("reservePrice");

  // Auto-set starting price based on monthly revenue if not already set
  useEffect(() => {
    if (monthlyRevenue && !form.getValues("startingPrice")) {
      form.setValue("startingPrice", monthlyRevenue * 10);
    }
  }, [monthlyRevenue, form]);

  // Auto-calculate reserve price as 60% of starting price if not already set
  useEffect(() => {
    if (startingPrice && isAuction && !form.getValues("reservePrice")) {
      const calculatedReserve = Math.round(startingPrice * 0.6);
      form.setValue("reservePrice", calculatedReserve);
    }
  }, [startingPrice, isAuction, form]);

  // Calculate recommended price decrement
  useEffect(() => {
    if (startingPrice && form.getValues("auctionDuration")) {
      const duration = form.getValues("auctionDuration") || "30days";
      const reservePriceValue = form.getValues("reservePrice") || 0;
      const priceDiff = startingPrice - reservePriceValue;
      let decrementDivisor = 720; // Default for 30 days with hourly decrements

      switch (duration) {
        case "14days":
          decrementDivisor = 336; // 336 hourly decrements in 14 days
          break;
        case "30days":
          decrementDivisor = 720; // 720 hourly decrements in 30 days
          break;
        case "60days":
          decrementDivisor = 1440; // 1440 hourly decrements in 60 days
          break;
        case "90days":
          decrementDivisor = 2160; // 2160 hourly decrements in 90 days
          break;
      }

      // Set decrement interval to hourly by default for better UX
      if (!form.getValues("priceDecrementInterval")) {
        form.setValue("priceDecrementInterval", "day");
      }

      // Calculate recommended decrement as priceDiff / decrementDivisor, rounded to nearest dollar
      const recommended = Math.max(1, Math.round(priceDiff / decrementDivisor));
      setRecommendedDecrement(recommended);

      // Auto-set price decrement if not already set
      if (!form.getValues("priceDecrement")) {
        form.setValue("priceDecrement", recommended);
      }
    }
  }, [startingPrice, reservePrice, form]);

  // Update noReserve flag whenever reservePrice changes
  useEffect(() => {
    // If reservePrice is 0, set noReserve to true
    if (reservePrice === 0) {
      form.setValue("noReserve", true);
    } else if (reservePrice !== undefined) {
      form.setValue("noReserve", false);
    }
  }, [reservePrice, form]);

  // FIXED: Set price when switching between auction and fixed price
  useEffect(() => {
    if (isAuction) {
      // When switching to auction, set price to null to avoid constraint error
      form.setValue("price", undefined);
    } else {
      // When switching to fixed price, initialize with a value if empty
      if (!form.getValues("price") && startingPrice) {
        form.setValue("price", startingPrice);
      }
    }
  }, [isAuction, startingPrice, form]);
  
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

  // Calculate auction end date based on duration
  const setAuctionEndDate = (duration: string) => {
    const today = new Date();
    let endDate: Date;
    switch (duration) {
      case "14days":
        endDate = addDays(today, 14);
        break;
      case "30days":
        endDate = addDays(today, 30);
        break;
      case "60days":
        endDate = addDays(today, 60);
        break;
      case "90days":
        endDate = addDays(today, 90);
        break;
      default:
        endDate = addDays(today, 30);
      // Default to 30 days
    }
    form.setValue("auctionEndTime", endDate);
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
      case "day":
        return "Per Day";
      case "week":
        return "Per Week";
      case "month":
        return "Per Month";
      default:
        return "Select interval";
    }
  };

  // Helper to get auction duration label
  const getAuctionDurationLabel = (duration: string) => {
    switch (duration) {
      case "14days":
        return "14 Days";
      case "30days":
        return "30 Days";
      case "60days":
        return "60 Days";
      case "90days":
        return "90 Days";
      default:
        return "Select duration";
    }
  };
  
  return <Card className="p-6 bg-white shadow-sm">
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
          {/* Starting Price and Reserve Price side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starting Price */}
            <FormField control={form.control} name="startingPrice" render={({
          field
        }) => <FormItem>
                  <FormLabel className="flex items-center gap-2 my-[16px]">
                    Starting Price (USD)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white">
                          <p>Starting price for your Dutch auction. Price drops until sold.</p>
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

            {/* Reserve Price */}
            <FormField control={form.control} name="reservePrice" render={({
          field
        }) => <FormItem className="my-[22px]">
                  <FormLabel className="flex items-center gap-2 my-0">
                    Reserve Price (USD)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white">
                          <p>The lowest price you're willing to accept. Set to 0 for a no-reserve auction that will sell at any price.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter reserve price" value={formatCurrencyInput(field.value?.toString() || '')} onChange={e => {
              const value = parseCurrencyValue(e.target.value);
              field.onChange(value >= 0 ? value : undefined);
            }} className="font-mono" />
                  </FormControl>
                  <FormMessage />
                  {field.value === 0 && <div className="text-xs text-amber-500 mt-1 flex items-center">
                      This will be a no-reserve auction (will sell at any price)
                    </div>}
                </FormItem>} />
          </div>

          {/* 4. Auction Duration */}
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
                          <p>How long your auction will run before it ends</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Select onValueChange={value => {
          field.onChange(value);
          setAuctionEndDate(value);
        }} defaultValue={field.value || "30days"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration">
                          {field.value ? getAuctionDurationLabel(field.value) : "30 Days"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="14days">14 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="60days">60 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 5. Price Decrement */}
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
                    <Input type="text" placeholder="Enter price decrement" value={formatCurrencyInput(field.value?.toString() || '')} onChange={e => {
              const value = parseCurrencyValue(e.target.value);
              field.onChange(value > 0 ? value : undefined);
            }} className="font-mono" />
                  </FormControl>
                  {recommendedDecrement > 0 && <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <button type="button" onClick={() => form.setValue("priceDecrement", recommendedDecrement)} className="text-primary hover:underline flex items-center">
                        Recommended: ${recommendedDecrement}/interval
                      </button>
                    </div>}
                  <FormMessage />
                </FormItem>} />

            {/* 6. Decrement Interval - MODIFIED: Removed minute and hour options */}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value || "day"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval">
                          {field.value ? getDecrementIntervalLabel(field.value) : "Select interval"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="day">Per Day</SelectItem>
                      <SelectItem value="week">Per Week</SelectItem>
                      <SelectItem value="month">Per Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
          </div>

          {/* Fix for the auctionEndTime field - return a proper React element instead of void */}
          <FormField control={form.control} name="auctionEndTime" render={({
        field
      }) => <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" />
                </FormControl>
              </FormItem>} />
          
          {/* Hidden field for noReserve to track it internally based on reservePrice */}
          <FormField control={form.control} name="noReserve" render={({
        field
      }) => <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" />
                </FormControl>
              </FormItem>} />
          
        </div> : <div className="space-y-4">
          <FormField control={form.control} name="price" render={({
        field
      }) => <FormItem>
                <FormLabel className="flex items-center gap-2 my-[16px]">
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

      <Card className="p-6 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white mt-6">
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
    </Card>;
}
