
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FinancialMetricsProps {
  product: {
    monthly_revenue?: number;
    monthly_profit?: number;
    gross_profit_margin?: number;
    customer_acquisition_cost?: number;
    monetization?: string;
    monetization_other?: string;
    monthly_churn_rate?: number;
    monthly_expenses?: Array<{
      id: string;
      name: string;
      amount: number;
      category: string;
    }>;
  };
}

export function FinancialMetrics({ product }: FinancialMetricsProps) {
  const totalMonthlyExpenses = product.monthly_expenses?.reduce((total, expense) => total + expense.amount, 0) || 0;
  const isRevenueTrendPositive = product.monthly_revenue && product.monthly_revenue > 0;
  const isProfitTrendPositive = product.monthly_profit && product.monthly_profit > 0;
  const isMarginGood = product.gross_profit_margin && product.gross_profit_margin >= 40;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <DollarSign className="h-4 w-4" />
        <span>Financial Overview</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Revenue</span>
            {isRevenueTrendPositive && <TrendingUp className="h-4 w-4 text-green-500" />}
          </div>
          <div className="text-xl font-bold text-blue-700">
            {product.monthly_revenue ? formatCurrency(product.monthly_revenue) : "Not disclosed"}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border border-green-100">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Profit</span>
            {isProfitTrendPositive && <TrendingUp className="h-4 w-4 text-green-500" />}
          </div>
          <div className="text-xl font-bold text-green-700">
            {product.monthly_profit ? formatCurrency(product.monthly_profit) : "Not disclosed"}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md cursor-help">
                <span className="text-gray-600">Gross Profit Margin</span>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-16 rounded-full overflow-hidden bg-gray-200`}>
                    <div 
                      className={`h-full ${isMarginGood ? 'bg-green-500' : 'bg-amber-500'}`} 
                      style={{ width: `${product.gross_profit_margin || 0}%` }} 
                    />
                  </div>
                  <span className={`font-medium ${isMarginGood ? 'text-green-600' : 'text-amber-600'}`}>
                    {product.gross_profit_margin ? `${product.gross_profit_margin}%` : "Not disclosed"}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm max-w-xs">
                Gross profit margin shows the percentage of revenue that exceeds the cost of goods sold.
                {product.gross_profit_margin && (
                  product.gross_profit_margin > 50 
                    ? " This is an excellent margin." 
                    : product.gross_profit_margin > 30 
                      ? " This is a good margin." 
                      : " This margin may need improvement."
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
          <span className="text-gray-600">Customer Acquisition Cost</span>
          <span className="font-medium">
            {product.customer_acquisition_cost ? formatCurrency(product.customer_acquisition_cost) : "Not disclosed"}
          </span>
        </div>
        
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
          <span className="text-gray-600">Monetization Model</span>
          <span className="font-medium">
            {product.monetization || product.monetization_other || "Not specified"}
          </span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md cursor-help">
                <span className="text-gray-600">Monthly Churn Rate</span>
                <div className="flex items-center gap-2">
                  {product.monthly_churn_rate !== undefined && product.monthly_churn_rate !== null && (
                    <>
                      <div className="h-2 w-16 rounded-full overflow-hidden bg-gray-200">
                        <div 
                          className={`h-full ${product.monthly_churn_rate <= 5 ? 'bg-green-500' : product.monthly_churn_rate <= 10 ? 'bg-amber-500' : 'bg-red-500'}`} 
                          style={{ width: `${Math.min(product.monthly_churn_rate * 5, 100)}%` }} 
                        />
                      </div>
                      <span className={`font-medium ${product.monthly_churn_rate <= 5 ? 'text-green-600' : product.monthly_churn_rate <= 10 ? 'text-amber-600' : 'text-red-600'}`}>
                        {`${product.monthly_churn_rate}%`}
                      </span>
                    </>
                  )}
                  {(product.monthly_churn_rate === undefined || product.monthly_churn_rate === null) && (
                    <span className="font-medium">Not disclosed</span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm max-w-xs">
                Monthly churn rate is the percentage of customers that stop using the product each month.
                {product.monthly_churn_rate !== undefined && product.monthly_churn_rate !== null && (
                  product.monthly_churn_rate <= 5 
                    ? " This is an excellent (low) churn rate." 
                    : product.monthly_churn_rate <= 10 
                      ? " This is an acceptable churn rate." 
                      : " This churn rate is high and may need attention."
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {product.monthly_expenses && product.monthly_expenses.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <PieChart className="h-4 w-4" />
            <span>Monthly Expenses Breakdown</span>
          </div>
          
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 text-left">Expense</th>
                  <th className="py-2 px-3 text-left">Category</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {product.monthly_expenses.map((expense, index) => (
                  <tr key={expense.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-3">{expense.name}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">{formatCurrency(expense.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={2} className="py-2 px-3 text-right">Total Monthly Expenses:</td>
                  <td className="py-2 px-3 text-right">{formatCurrency(totalMonthlyExpenses)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Expense to Revenue Ratio Indicator */}
          {product.monthly_revenue && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Expense to Revenue Ratio:</span>
                <span className={`font-medium ${(totalMonthlyExpenses / product.monthly_revenue) <= 0.6 ? 'text-green-600' : 'text-amber-600'}`}>
                  {((totalMonthlyExpenses / product.monthly_revenue) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full overflow-hidden bg-gray-200">
                <div 
                  className={`h-full ${(totalMonthlyExpenses / product.monthly_revenue) <= 0.6 ? 'bg-green-500' : 'bg-amber-500'}`} 
                  style={{ width: `${Math.min((totalMonthlyExpenses / product.monthly_revenue) * 100, 100)}%` }} 
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
