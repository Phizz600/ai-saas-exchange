
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ListProductFormData } from "../types";

interface AuctionSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function AuctionSection({ form }: AuctionSectionProps) {
  const watchIsAuction = form.watch("isAuction");
  const watchPriceDecrementInterval = form.watch("priceDecrementInterval");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Selling Method</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-4 p-4 border rounded-md bg-slate-50">
          <div>
            <Label htmlFor="is-auction" className="font-medium">Dutch Auction</Label>
            <p className="text-sm text-gray-500 mt-1">
              Start high and let the price automatically decrease over time
            </p>
          </div>
          <FormField
            control={form.control}
            name="isAuction"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    id="is-auction"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {!watchIsAuction && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fixed Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter a fixed price"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                  />
                </FormControl>
                <FormDescription>
                  This is the price at which you want to sell your product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchIsAuction && (
          <div className="space-y-4 border rounded-md p-4 bg-white">
            <h3 className="text-lg font-semibold">Dutch Auction Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Starting Price ($)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60">The initial price of your auction. This is typically higher than your expected selling price.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter starting price"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Minimum Price ($)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60">The lowest price you're willing to accept. The auction will stop decreasing at this price.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter minimum price"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priceDecrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Price Decrement ($)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60">The amount by which the price will decrease at each interval.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price decrement"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
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
                    <FormLabel className="flex items-center gap-1.5">
                      Decrement Interval
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60">How often the price will decrease by the decrement amount.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="minute">Every Minute</SelectItem>
                        <SelectItem value="hour">Every Hour</SelectItem>
                        <SelectItem value="day">Every Day</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 mt-2">
                Your price will decrease by ${form.watch("priceDecrement") || 0} every {watchPriceDecrementInterval === "minute" ? "minute" : watchPriceDecrementInterval === "hour" ? "hour" : "day"} until it reaches ${form.watch("minPrice") || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
