
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface AuctionSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function AuctionSection({ form }: AuctionSectionProps) {
  const watchIsAuction = form.watch("isAuction");
  const watchNoReserve = form.watch("noReserve");
  const reservePrice = form.watch("reservePrice");
  const startingPrice = form.watch("startingPrice");

  // Set appropriate auction fields based on auction type
  useEffect(() => {
    if (!watchIsAuction) {
      // If not an auction, clear auction-specific fields
      form.setValue("startingPrice", undefined);
      form.setValue("reservePrice", undefined);
      form.setValue("priceDecrement", undefined);
      form.setValue("noReserve", false);
      form.setValue("auctionDuration", "30days");
    } else {
      // If it is an auction, ensure we have valid defaults
      if (form.getValues("startingPrice") === undefined) {
        form.setValue("startingPrice", 0);
      }
      
      if (form.getValues("priceDecrement") === undefined) {
        form.setValue("priceDecrement", 10);
      }
      
      if (form.getValues("auctionDuration") === undefined) {
        form.setValue("auctionDuration", "30days");
      }
    }
  }, [watchIsAuction, form]);

  // Handle reserve price and no reserve option
  useEffect(() => {
    if (watchNoReserve) {
      form.setValue("reservePrice", 0);
    } else if (reservePrice === 0) {
      form.setValue("reservePrice", undefined);
    }
  }, [watchNoReserve, reservePrice, form]);

  // Ensure starting price is higher than reserve price
  useEffect(() => {
    if (reservePrice !== undefined && startingPrice !== undefined && reservePrice >= startingPrice) {
      // If reserve price is higher than starting price, display an error
      form.setError("reservePrice", {
        type: "manual",
        message: "Reserve price must be lower than starting price"
      });
    } else {
      // Clear the error if the condition is no longer met
      form.clearErrors("reservePrice");
    }
  }, [reservePrice, startingPrice, form]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-50">Selling Method</h2>
      
      <FormField
        control={form.control}
        name="isAuction"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Choose a Selling Method</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "true")}
                defaultValue={field.value ? "true" : "false"}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="false" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Fixed Price - Set a price, and the first buyer to pay gets your product
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="true" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Dutch Auction - Price starts high and drops gradually until someone buys
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Choose how you want to sell your product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchIsAuction ? (
        // Dutch Auction Section
        <Card className="border border-amber-300/20 bg-amber-50/10">
          <CardContent className="pt-6 space-y-6">
            <Alert className="bg-amber-100/30 border-amber-300/30">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-700">
                In a Dutch auction, the price starts high and decreases over time until someone buys. 
                The first person to bid at the current price wins the auction immediately.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Starting Price ($)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white">
                            <p>The price at which the auction begins</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Starting price" 
                        {...field} 
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                        min={0}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the initial price of your auction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reservePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Reserve Price ($)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white">
                            <p>The minimum price you're willing to sell the product for. The auction will end if the price drops below this value.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Reserve price" 
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? undefined : value);
                        }}
                        min={0}
                        disabled={watchNoReserve}
                      />
                    </FormControl>
                    <FormDescription>
                      The auction will end if the price drops below this value
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noReserve"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>No Reserve</FormLabel>
                      <FormDescription>
                        The product will sell at any price
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceDecrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Price Decrement ($)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white">
                            <p>The amount the price drops each interval</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Price decrement" 
                        {...field} 
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                        min={0}
                      />
                    </FormControl>
                    <FormDescription>
                      The price will drop by this amount each interval
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceDecrementInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Decrement Interval
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white">
                            <p>How often the price drops</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="item-aligned" className="bg-white">
                        <SelectItem value="hour">Hourly</SelectItem>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The price will drop by the decrement amount every interval
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="auctionDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Auction Duration
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white">
                            <p>How long the auction will last</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="item-aligned" className="bg-white">
                        <SelectItem value="24hours">24 Hours</SelectItem>
                        <SelectItem value="3days">3 Days</SelectItem>
                        <SelectItem value="7days">7 Days</SelectItem>
                        <SelectItem value="14days">14 Days</SelectItem>
                        <SelectItem value="30days">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The auction will last for this duration
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        // Fixed Price Section
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Listing Price ($)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white">
                        <p>The fixed price for your product</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Set your price" 
                    {...field} 
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      field.onChange(isNaN(value) ? undefined : value);
                    }}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
