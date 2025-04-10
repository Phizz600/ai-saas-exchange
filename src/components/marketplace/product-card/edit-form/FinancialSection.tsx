import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData, ExpenseItem } from "../../list-product/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateUniqueId } from "@/lib/utils";

interface FinancialSectionProps {
  form: UseFormReturn<Partial<ListProductFormData>>;
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

export const FinancialSection = ({ form }: FinancialSectionProps) => {
  const monthlyExpenses = form.watch('monthlyExpenses') || [];
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<string>('other');

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
      form.setValue('monthlyExpenses', updatedExpenses);
    }
  };

  const calculateTotalExpenses = () => {
    return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="monthlyRevenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>MRR or AMR (Monthly Revenue)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="monthlyProfit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Profit</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Monthly Expenses Section */}
      <div className="col-span-2 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Monthly Expenses</h3>
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
                          form.setValue('monthlyExpenses', updatedExpenses);
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
                          form.setValue('monthlyExpenses', updatedExpenses);
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
    </>
  );
};
