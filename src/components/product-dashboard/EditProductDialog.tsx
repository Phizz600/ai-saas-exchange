
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn, generateUniqueId } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExpenseItem } from "../marketplace/list-product/types";

interface EditProductDialogProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    monthly_revenue?: number;
    monthly_traffic?: number;
    starting_price?: number;
    min_price?: number;
    price_decrement?: number;
    price_decrement_interval?: string;
    auction_end_time?: string;
    monthly_expenses?: ExpenseItem[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EditProductFormData {
  title: string;
  description: string;
  price: number;
  monthly_revenue: number;
  monthly_traffic: number;
  starting_price?: number;
  min_price?: number;
  price_decrement?: number;
  price_decrement_interval?: 'minute' | 'hour' | 'day' | 'week' | 'month';
  auction_end_time?: Date;
  monthly_expenses?: ExpenseItem[];
}

const EXPENSE_CATEGORIES = [
  'hosting',
  'apis',
  'personnel',
  'marketing',
  'software',
  'subscription',
  'office',
  'other'
] as const;

const COMMON_EXPENSES = [
  { name: 'Hosting', category: 'hosting' },
  { name: 'Domain', category: 'hosting' },
  { name: 'OpenAI API', category: 'apis' },
  { name: 'External APIs', category: 'apis' },
  { name: 'Marketing', category: 'marketing' },
  { name: 'Software Subscriptions', category: 'subscription' },
  { name: 'Freelancers', category: 'personnel' },
];

export function EditProductDialog({ product, isOpen, onClose }: EditProductDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<EditProductFormData>({
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      monthly_revenue: product?.monthly_revenue || 0,
      monthly_traffic: product?.monthly_traffic || 0,
      starting_price: product?.starting_price || 0,
      min_price: product?.min_price || 0,
      price_decrement: product?.price_decrement || 0,
      price_decrement_interval: (product?.price_decrement_interval as EditProductFormData['price_decrement_interval']) || 'hour',
      auction_end_time: product?.auction_end_time ? new Date(product.auction_end_time) : undefined,
      monthly_expenses: product?.monthly_expenses || [],
    },
  });

  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<string>('other');
  const monthlyExpenses = form.watch('monthly_expenses') || [];

  const formatValue = (value: string | number) => {
    if (typeof value === 'number') value = value.toString();
    // Remove any existing formatting first (but keep decimal part)
    const parts = value.replace(/[,$]/g, '').split('.');
    const plainNumber = parts[0];
    const decimals = parts[1];
    
    // Format with commas and dollar sign, preserving decimals if they exist
    let formattedNumber = plainNumber ? `$${Number(plainNumber).toLocaleString()}` : '';
    if (decimals !== undefined) {
      formattedNumber += `.${decimals}`;
    }
    return formattedNumber;
  };

  const parseValue = (value: string) => {
    // Extract just the number from the formatted string, preserving decimals
    const numericValue = Number(value.replace(/[,$]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const addExpense = () => {
    if (!newExpenseName.trim() || parseValue(newExpenseAmount) <= 0) return;
    
    const newExpense: ExpenseItem = {
      id: generateUniqueId(),
      name: newExpenseName.trim(),
      amount: parseValue(newExpenseAmount),
      category: newExpenseCategory
    };
    
    const updatedExpenses = [...monthlyExpenses, newExpense];
    form.setValue('monthly_expenses', updatedExpenses);
    
    // Reset form
    setNewExpenseName('');
    setNewExpenseAmount('');
    setNewExpenseCategory('other');
  };

  const removeExpense = (id: string) => {
    const updatedExpenses = monthlyExpenses.filter(expense => expense.id !== id);
    form.setValue('monthly_expenses', updatedExpenses);
  };

  const addCommonExpense = (expenseName: string, category: string) => {
    // Check if this expense already exists
    const exists = monthlyExpenses.some(
      expense => expense.name.toLowerCase() === expenseName.toLowerCase()
    );
    
    if (!exists) {
      const newExpense: ExpenseItem = {
        id: generateUniqueId(),
        name: expenseName,
        amount: 0, // Default to 0, user can update later
        category
      };
      
      const updatedExpenses = [...monthlyExpenses, newExpense];
      form.setValue('monthly_expenses', updatedExpenses);
    }
  };

  const calculateTotalExpenses = () => {
    return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const onSubmit = async (data: EditProductFormData) => {
    try {
      if (!product?.id) return;

      const { error } = await supabase
        .from('products')
        .update({
          title: data.title,
          description: data.description,
          price: data.price,
          monthly_revenue: data.monthly_revenue,
          monthly_traffic: data.monthly_traffic,
          starting_price: data.starting_price,
          min_price: data.min_price,
          price_decrement: data.price_decrement,
          price_decrement_interval: data.price_decrement_interval,
          auction_end_time: data.auction_end_time?.toISOString(),
          current_price: data.starting_price, // Reset current price to starting price when edited
          monthly_expenses: data.monthly_expenses,
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: "Your product has been successfully updated.",
      });

      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthly_revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Revenue ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="monthly_traffic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Traffic</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-4">Dutch Auction Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="starting_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Starting Price ($)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Initial price for the Dutch auction</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="min_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Minimum Price ($)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Lowest acceptable price</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price_decrement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Price Decrement ($)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Amount by which the price decreases per interval</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_decrement_interval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Decrement Interval
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>How often the price decreases</p>
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
                          <SelectContent>
                            <SelectItem value="day">Per Day</SelectItem>
                            <SelectItem value="week">Per Week</SelectItem>
                            <SelectItem value="month">Per Month</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="auction_end_time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-2">
                        Auction End Time
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>When the auction will automatically end</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Monthly Expenses Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Monthly Expenses</h3>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  Total: <span className="font-semibold">${calculateTotalExpenses().toLocaleString()}</span>
                </div>
              </div>
              
              {/* Quick Add Buttons */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Common expenses:</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_EXPENSES.map((expense) => (
                    <Button 
                      key={expense.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addCommonExpense(expense.name, expense.category)}
                      className="text-xs"
                    >
                      + {expense.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Add New Expense Form */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
                <div className="md:col-span-5">
                  <Input
                    placeholder="Expense name"
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    placeholder="Amount ($)"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Select value={newExpenseCategory} onValueChange={setNewExpenseCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned" className="bg-white">
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1">
                  <Button 
                    type="button" 
                    onClick={addExpense}
                    className="w-full h-full"
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expenses List */}
              {monthlyExpenses.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Expense</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyExpenses.map((expense, index) => (
                        <tr key={expense.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2 border-t">
                            <Input
                              value={expense.name}
                              onChange={(e) => {
                                const updatedExpenses = [...monthlyExpenses];
                                updatedExpenses[index].name = e.target.value;
                                form.setValue('monthly_expenses', updatedExpenses);
                              }}
                              className="h-8 min-h-8"
                            />
                          </td>
                          <td className="px-4 py-2 border-t">
                            <Select 
                              value={expense.category} 
                              onValueChange={(value) => {
                                const updatedExpenses = [...monthlyExpenses];
                                updatedExpenses[index].category = value;
                                form.setValue('monthly_expenses', updatedExpenses);
                              }}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="item-aligned" className="bg-white">
                                {EXPENSE_CATEGORIES.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2 border-t">
                            <Input
                              value={expense.amount ? formatValue(expense.amount) : ''}
                              onChange={(e) => {
                                const value = parseValue(e.target.value);
                                if (!isNaN(value)) {
                                  const updatedExpenses = [...monthlyExpenses];
                                  updatedExpenses[index].amount = value;
                                  form.setValue('monthly_expenses', updatedExpenses);
                                }
                              }}
                              className="h-8 min-h-8 text-right"
                            />
                          </td>
                          <td className="px-4 py-2 border-t text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeExpense(expense.id)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium">
                      <tr>
                        <td className="px-4 py-2 border-t" colSpan={2}>
                          Total Monthly Expenses
                        </td>
                        <td className="px-4 py-2 border-t text-right">
                          ${calculateTotalExpenses().toLocaleString()}
                        </td>
                        <td className="px-4 py-2 border-t"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No expenses added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add your monthly expenses to help buyers understand your business costs</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
