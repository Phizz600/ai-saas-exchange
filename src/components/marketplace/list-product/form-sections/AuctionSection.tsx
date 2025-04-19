
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListProductFormData } from "../types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Info, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

interface AuctionSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

const formatCurrency = (value: number | undefined) => {
  if (value === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export function AuctionSection({ form }: AuctionSectionProps) {
  const isAuction = form.watch("isAuction");
  const startingPrice = form.watch("startingPrice");
  const priceDecrement = form.watch("priceDecrement");
  const priceDecrementInterval = form.watch("priceDecrementInterval") || "day";
  const noReserve = form.watch("noReserve");
  const reservePrice = form.watch("reservePrice");
  
  // Initialize the price decrement interval if not set
  useEffect(() => {
    if (!form.getValues("priceDecrementInterval")) {
      form.setValue("priceDecrementInterval", "day");
    }
  }, [form]);
  
  // Format currency inputs
  const formatCurrencyInput = (value: string) => {
    if (!value) return '';
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue)) return '';
    return numericValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const parseCurrencyValue = (value: string) => {
    return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  };

  // When auction toggle changes, sync values
  useEffect(() => {
    if (isAuction) {
      // If we're switching to auction mode, copy the price to starting price if available
      const currentPrice = form.getValues("price");
      if (currentPrice && !form.getValues("startingPrice")) {
        form.setValue("startingPrice", currentPrice);
      }
    } else {
      // If we're switching to fixed price mode, copy the starting price to price if available
      const currentStartingPrice = form.getValues("startingPrice");
      if (currentStartingPrice && !form.getValues("price")) {
        form.setValue("price", currentStartingPrice);
      }
    }
  }, [isAuction, form]);

  // Update price when auction values change (this helps ensure price is set correctly)
  useEffect(() => {
    if (isAuction && startingPrice) {
      form.setValue("price", startingPrice);
    }
  }, [isAuction, startingPrice, form]);

  // When noReserve is toggled on, set reservePrice to 0
  useEffect(() => {
    if (noReserve) {
      form.setValue("reservePrice", 0);
    }
  }, [noReserve, form]);

  return (
    <Card className="p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold exo-2-heading bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent mb-6">Selling Method</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auction-toggle" className="text-base font-medium">Dutch Auction</Label>
            <p className="text-sm text-gray-500">Sell your product through a time-based auction with decreasing prices</p>
          </div>
          <FormField
            control={form.control}
            name="isAuction"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    id="auction-toggle"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {isAuction ? (
          <div className="space-y-6">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                In a Dutch auction, the price decreases over time. The first valid bid wins the auction.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Starting Price
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white">
                            <p>The initial price that the auction will start at</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={formatCurrencyInput(field.value?.toString() || '')}
                        onChange={e => {
                          const value = parseCurrencyValue(e.target.value);
                          field.onChange(value);
                          // Sync with price field to ensure it's not null
                          form.setValue("price", value);
                        }}
                        placeholder="$1,000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priceDecrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Price Drop Amount
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-white">
                              <p>How much the price will decrease each interval</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={formatCurrencyInput(field.value?.toString() || '')}
                          onChange={e => field.onChange(parseCurrencyValue(e.target.value))}
                          placeholder="$50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceDecrementInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop Interval</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="item-aligned" className="bg-white">
                          <SelectItem value="hour">Every hour</SelectItem>
                          <SelectItem value="day">Every day</SelectItem>
                          <SelectItem value="week">Every week</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="no-reserve-toggle" className="text-base font-medium">No Reserve Price</Label>
                    <p className="text-sm text-gray-500">Auction will run until someone places a bid (recommended)</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="noReserve"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            id="no-reserve-toggle"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {!noReserve && (
                  <FormField
                    control={form.control}
                    name="reservePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Reserve Price
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-white">
                                <p>The minimum price you're willing to accept. Auction will end when price reaches this amount.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            value={formatCurrencyInput(field.value?.toString() || '')}
                            onChange={e => field.onChange(parseCurrencyValue(e.target.value))}
                            placeholder="$500"
                            disabled={noReserve}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="auctionDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auction Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="item-aligned" className="bg-white">
                        <SelectItem value="24hours">24 hours</SelectItem>
                        <SelectItem value="3days">3 days</SelectItem>
                        <SelectItem value="7days">7 days</SelectItem>
                        <SelectItem value="14days">14 days</SelectItem>
                        <SelectItem value="30days">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {startingPrice && priceDecrement && priceDecrementInterval && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Auction Summary</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Starting Price: {formatCurrency(startingPrice)}</p>
                  <p>Price will drop by {formatCurrency(priceDecrement)} every {priceDecrementInterval}</p>
                  {noReserve ? (
                    <p>No reserve price - auction runs until someone places a bid</p>
                  ) : (
                    <p>Reserve Price: {formatCurrency(reservePrice)} - auction ends if price reaches this amount</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fixed Price</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={formatCurrencyInput(field.value?.toString() || '')}
                    onChange={e => field.onChange(parseCurrencyValue(e.target.value))}
                    placeholder="Enter your asking price"
                  />
                </FormControl>
                <FormDescription>
                  Enter the fixed price for your product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </Card>
  );
}
