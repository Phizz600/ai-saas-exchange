import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData, ExpenseItem } from "../types";
import { Info, Plus, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateUniqueId } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface FinancialSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

const MONETIZATION_OPTIONS = ['subscription', 'pay_per_use', 'freemium', 'one_time_purchase', 'usage_based', 'tiered_pricing', 'enterprise_licensing', 'marketplace_commission', 'advertising', 'data_monetization', 'affiliate', 'other'] as const;
const EXPENSE_CATEGORIES = ['hosting', 'apis', 'personnel', 'marketing', 'software', 'subscription', 'office', 'other'] as const;
const COMMON_EXPENSES = [{
  name: 'Hosting',
  category: 'hosting'
}, {
  name: 'Domain',
  category: 'hosting'
}, {
  name: 'OpenAI API',
  category: 'apis'
}, {
  name: 'External APIs',
  category: 'apis'
}, {
  name: 'Marketing',
  category: 'marketing'
}, {
  name: 'Software Subscriptions',
  category: 'subscription'
}, {
  name: 'Freelancers',
  category: 'personnel'
}];

const formatValue = (value: string) => {
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

export function FinancialSection({
  form
}: FinancialSectionProps) {
  const showMonetizationOther = form.watch('monetization') === 'other';
  const monthlyExpenses = form.watch('monthlyExpenses') || [];
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<string>('other');

  const addExpense = () => {
    if (!newExpenseName.trim() || parseValue(newExpenseAmount) <= 0) return;

    const newExpense: ExpenseItem = {
      id: generateUniqueId(),
      name: newExpenseName.trim(),
      amount: parseValue(newExpenseAmount),
      category: newExpenseCategory
    };

    const updatedExpenses = [...monthlyExpenses, newExpense];
    form.setValue('monthlyExpenses', updatedExpenses);

    // Reset form
    setNewExpenseName('');
    setNewExpenseAmount('');
    setNewExpenseCategory('other');
  };

  const removeExpense = (id: string) => {
    const updatedExpenses = monthlyExpenses.filter(expense => expense.id !== id);
    form.setValue('monthlyExpenses', updatedExpenses);
  };

  const addCommonExpense = (expenseName: string, category: string) => {
    // Check if this expense already exists
    const exists = monthlyExpenses.some(expense => expense.name.toLowerCase() === expenseName.toLowerCase());

    if (!exists) {
      const newExpense: ExpenseItem = {
        id: generateUniqueId(),
        name: expenseName,
        amount: 0, // Default to 0, user can update later
        category
      };

      const updatedExpenses = [...monthlyExpenses, newExpense];
      form.setValue('monthlyExpenses', updatedExpenses);
    }
  };

  const calculateTotalExpenses = () => {
    return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-50 mb-6">Financials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={form.control} name="monthlyRevenue" render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              MRR or AMR (Monthly Revenue)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white">
                    <p>Monthly Recurring Revenue (MRR) or Average Monthly Revenue (AMR) from your AI product</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter monthly revenue in USD"
                value={field.value ? formatValue(field.value.toString()) : ''}
                onChange={e => {
                  const value = parseValue(e.target.value);
                  if (value >= 0) {
                    field.onChange(value);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="monthlyProfit" render={({ field }) => (
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
                placeholder="Enter monthly profit in USD"
                value={field.value ? formatValue(field.value.toString()) : ''}
                onChange={e => {
                  const value = parseValue(e.target.value);
                  if (value >= 0) {
                    field.onChange(value);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="customerAcquisitionCost" render={({ field }) => (
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
                placeholder="Enter CAC in USD"
                value={field.value ? formatValue(field.value.toString()) : ''}
                onChange={e => {
                  const value = parseValue(e.target.value);
                  if (value >= 0) {
                    field.onChange(value);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="monetization" render={({ field }) => (
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
                {MONETIZATION_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>
                    {option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {showMonetizationOther && (
          <FormField control={form.control} name="monetizationOther" render={({ field }) => (
            <FormItem>
              <FormLabel>Other Monetization Strategy</FormLabel>
              <FormControl>
                <Input placeholder="Describe your monetization strategy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />}

        <FormField control={form.control} name="grossProfitMargin" render={({ field }) => (
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
                value={field.value ?? ''}
                onChange={e => {
                  const value = Number(e.target.value);
                  field.onChange(isNaN(value) ? undefined : value);
                }}
                min="0"
                max="100"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="monthlyChurnRate" render={({ field }) => (
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
                value={field.value ?? ''}
                onChange={e => {
                  const value = Number(e.target.value);
                  field.onChange(isNaN(value) ? undefined : value);
                }}
                min="0"
                max="100"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {/* Monthly Expenses Section */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Monthly Expenses</h3>
          
        </div>
        
        {/* Quick Add Buttons */}
        <div className="mb-4">
          <p className="text-sm mb-2 text-slate-50">Common expenses:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_EXPENSES.map(expense => (
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
              onChange={e => setNewExpenseName(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Input
              placeholder="Amount ($)"
              value={newExpenseAmount}
              onChange={e => setNewExpenseAmount(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Select value={newExpenseCategory} onValueChange={setNewExpenseCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent position="item-aligned" className="bg-white">
                {EXPENSE_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-1">
            <Button type="button" onClick={addExpense} className="w-full h-full" variant="secondary">
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
                        onChange={e => {
                          const updatedExpenses = [...monthlyExpenses];
                          updatedExpenses[index].name = e.target.value;
                          form.setValue('monthlyExpenses', updatedExpenses);
                        }}
                        className="h-8 min-h-8"
                      />
                    </td>
                    <td className="px-4 py-2 border-t">
                      <Select
                        value={expense.category}
                        onValueChange={value => {
                          const updatedExpenses = [...monthlyExpenses];
                          updatedExpenses[index].category = value;
                          form.setValue('monthlyExpenses', updatedExpenses);
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="item-aligned" className="bg-white">
                          {EXPENSE_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 border-t">
                      <Input
                        value={expense.amount ? formatValue(expense.amount.toString()) : ''}
                        onChange={e => {
                          const value = parseValue(e.target.value);
                          if (!isNaN(value)) {
                            const updatedExpenses = [...monthlyExpenses];
                            updatedExpenses[index].amount = value;
                            form.setValue('monthlyExpenses', updatedExpenses);
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
    </Card>
  );
}
