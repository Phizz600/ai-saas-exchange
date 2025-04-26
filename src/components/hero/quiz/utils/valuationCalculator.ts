
// Import necessary dependencies
import { calculateValuation } from "@/components/marketplace/list-product/utils/valuationCalculator";
import { QuizAnswer } from "../types";

export interface ValuationResult {
  estimatedValue: {
    low: number;
    high: number;
  };
  insights: string[];
  recommendations: string[];
}

export const calculateQuizValuation = async (answers: Record<number, string>): Promise<ValuationResult> => {
  // Convert MRR to annual (assume answer 1 is monthly revenue)
  const monthlyRevenue = parseFloat(answers[1]) || 0;
  const annualRevenue = monthlyRevenue * 12;

  // Parse other metrics from answers
  const churnRate = parseFloat(answers[2]) / 100 || 0.05; // Default to 5% if not provided
  const grossMargin = parseFloat(answers[3]) / 100 || 0.7; // Default to 70% if not provided
  const industry = answers[4] || "fintech";
  const hasPatents = answers[5]?.toLowerCase().includes("yes") || false;

  // Calculate valuation using marketplace calculator
  const valuation = await calculateValuation(
    monthlyRevenue,
    churnRate,
    grossMargin,
    industry,
    hasPatents
  );

  // Generate insights based on metrics
  const insights = generateInsights({
    monthlyRevenue,
    churnRate,
    grossMargin,
    industry,
    hasPatents
  });

  // Generate recommendations
  const recommendations = generateRecommendations({
    monthlyRevenue,
    churnRate,
    grossMargin,
    industry
  });

  return {
    estimatedValue: valuation,
    insights,
    recommendations
  };
};

const generateInsights = (metrics: any): string[] => {
  const insights: string[] = [];

  if (metrics.monthlyRevenue > 50000) {
    insights.push("Your revenue is in a healthy range for acquisition interest.");
  }

  if (metrics.churnRate < 0.05) {
    insights.push("Your low churn rate indicates strong product-market fit.");
  }

  if (metrics.grossMargin > 0.7) {
    insights.push("Your high gross margins are attractive to potential buyers.");
  }

  if (metrics.hasPatents) {
    insights.push("Your intellectual property adds significant value to your business.");
  }

  return insights;
};

const generateRecommendations = (metrics: any): string[] => {
  const recommendations: string[] = [];

  if (metrics.monthlyRevenue < 10000) {
    recommendations.push("Focus on revenue growth to increase valuation.");
  }

  if (metrics.churnRate > 0.05) {
    recommendations.push("Work on reducing churn to improve customer retention.");
  }

  if (metrics.grossMargin < 0.7) {
    recommendations.push("Look for opportunities to improve profit margins.");
  }

  return recommendations;
};
