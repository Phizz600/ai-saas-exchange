
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <DollarSign className="h-4 w-4" />
        <span>Financial Overview</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Monthly Revenue</span>
          <span className="font-medium">{product.monthly_revenue ? formatCurrency(product.monthly_revenue) : "Not disclosed"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Monthly Profit</span>
          <span className="font-medium">{product.monthly_profit ? formatCurrency(product.monthly_profit) : "Not disclosed"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Gross Profit Margin</span>
          <span className="font-medium">{product.gross_profit_margin ? `${product.gross_profit_margin}%` : "Not disclosed"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Customer Acquisition Cost</span>
          <span className="font-medium">{product.customer_acquisition_cost ? formatCurrency(product.customer_acquisition_cost) : "Not disclosed"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Monetization</span>
          <span className="font-medium">{product.monetization || product.monetization_other || "Not specified"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Monthly Churn Rate</span>
          <span className="font-medium">{product.monthly_churn_rate ? `${product.monthly_churn_rate}%` : "Not disclosed"}</span>
        </div>
      </div>

      {product.monthly_expenses && product.monthly_expenses.length > 0 && (
        <div className="mt-4">
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
                    <td className="py-2 px-3">{expense.category}</td>
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
        </div>
      )}
    </div>
  );
}
