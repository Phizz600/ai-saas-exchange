
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
  confidenceScore: number; // Added confidence score
}

// AI category multipliers
const AI_CATEGORY_MULTIPLIERS: Record<string, number> = {
  nlp: 1.4,    // Natural Language Processing / Generative AI (highest demand)
  cv: 1.3,     // Computer Vision
  ml: 1.2,     // Machine Learning
  automation: 1.15, // AI Automation
  other: 1.0   // Other AI categories
};

// User base value factors
const USER_BASE_MULTIPLIERS: Record<string, number> = {
  '500000': 1.3,  // 100k+ users
  '50000': 1.2,   // 10k-100k users
  '5000': 1.1,    // 1k-10k users
  '500': 1.0,     // 100-1k users
  '50': 0.9       // Under 100 users
};

// Growth rate multipliers
const GROWTH_RATE_MULTIPLIERS: Record<string, number> = {
  '150': 1.5,   // 100%+ growth
  '75': 1.3,    // 50-100% growth
  '35': 1.2,    // 20-50% growth
  '10': 1.0     // 0-20% growth
};

// Market trend factors
const MARKET_TREND_MULTIPLIERS: Record<string, number> = {
  'emerging': 1.4,  // Emerging/high growth market
  'growing': 1.2,   // Growing market
  'stable': 1.0,    // Stable market
  'declining': 0.8  // Declining market
};

export const calculateQuizValuation = async (answers: Record<number, string>): Promise<ValuationResult> => {
  // Convert MRR to annual (assume answer 2 is monthly revenue)
  const monthlyRevenue = parseFloat(answers[2]) || 0;
  const annualRevenue = monthlyRevenue * 12;

  // Get AI category (question 1)
  const aiCategory = answers[1] || "other";
  
  // Get active users (question 3)
  const activeUsers = answers[3] || "500";
  
  // Get growth rate (question 4)
  const growthRate = answers[4] || "10";
  
  // Get market trend (question 5)
  const marketTrend = answers[5] || "stable";
  
  // Default metrics (if not provided)
  const churnRate = 0.05; // 5% default
  const grossMargin = 0.7; // 70% default
  const hasPatents = false; // Default to no patents

  // Calculate base valuation using the marketplace calculator
  const baseValuation = await calculateValuation(
    monthlyRevenue,
    churnRate,
    grossMargin,
    "ai", // Industry is always AI for the quiz
    hasPatents
  );

  // Apply multipliers to the base valuation
  const categoryMultiplier = AI_CATEGORY_MULTIPLIERS[aiCategory] || 1.0;
  const userBaseMultiplier = USER_BASE_MULTIPLIERS[activeUsers] || 1.0;
  const growthMultiplier = GROWTH_RATE_MULTIPLIERS[growthRate] || 1.0;
  const marketTrendMultiplier = MARKET_TREND_MULTIPLIERS[marketTrend] || 1.0;

  // Calculate enhanced valuation with all multipliers
  const combinedMultiplier = categoryMultiplier * userBaseMultiplier * growthMultiplier * marketTrendMultiplier;
  
  const enhancedValuation = {
    low: Math.round(baseValuation.low * combinedMultiplier),
    high: Math.round(baseValuation.high * combinedMultiplier)
  };

  // Calculate confidence score based on completeness of answers (0-100)
  const providedAnswers = Object.keys(answers).length;
  const totalQuestions = 5; // Total number of meaningful questions for valuation
  const confidenceScore = Math.min(100, Math.round((providedAnswers / totalQuestions) * 100));

  // Generate category-specific insights
  const insights = generateInsights({
    monthlyRevenue,
    aiCategory,
    activeUsers,
    growthRate,
    marketTrend,
    hasPatents,
    valuation: enhancedValuation
  });

  // Generate category-specific recommendations
  const recommendations = generateRecommendations({
    monthlyRevenue,
    aiCategory,
    activeUsers,
    growthRate,
    marketTrend
  });

  return {
    estimatedValue: enhancedValuation,
    insights,
    recommendations,
    confidenceScore
  };
};

const generateInsights = (metrics: any): string[] => {
  const insights: string[] = [];

  // Revenue insights
  if (metrics.monthlyRevenue > 50000) {
    insights.push(`Your monthly revenue of $${metrics.monthlyRevenue.toLocaleString()} puts you in the top tier of AI SaaS businesses.`);
  } else if (metrics.monthlyRevenue > 10000) {
    insights.push(`Your monthly revenue of $${metrics.monthlyRevenue.toLocaleString()} indicates a growing business with good acquisition potential.`);
  } else {
    insights.push(`At $${metrics.monthlyRevenue.toLocaleString()} monthly revenue, you're in the early stage of your business journey.`);
  }

  // Category insights
  if (metrics.aiCategory === 'nlp') {
    insights.push("Natural Language Processing and Generative AI solutions are currently commanding the highest valuations in the market.");
  } else if (metrics.aiCategory === 'cv') {
    insights.push("Computer Vision applications are seeing strong demand, particularly in security, retail, and healthcare sectors.");
  }

  // User base insights
  if (parseInt(metrics.activeUsers) > 10000) {
    insights.push(`Your large user base of ${parseInt(metrics.activeUsers).toLocaleString()}+ users represents significant market validation.`);
  }

  // Growth insights
  if (parseInt(metrics.growthRate) > 50) {
    insights.push(`Your exceptional growth rate of ${metrics.growthRate}%+ is a key factor boosting your valuation.`);
  }

  // Market trend insights
  if (metrics.marketTrend === 'emerging') {
    insights.push("Operating in an emerging market positions you for potential rapid value appreciation as the sector matures.");
  }

  return insights;
};

const generateRecommendations = (metrics: any): string[] => {
  const recommendations: string[] = [];

  // Revenue-based recommendations
  if (metrics.monthlyRevenue < 10000) {
    recommendations.push("Focus on achieving product-market fit and growing monthly recurring revenue to improve valuation.");
  }

  // Category-specific recommendations
  if (metrics.aiCategory === 'nlp') {
    recommendations.push("Consider developing specialized NLP models for high-value industries like healthcare or finance to increase valuation.");
  } else if (metrics.aiCategory === 'automation') {
    recommendations.push("Targeting enterprise clients with your AI automation solution can significantly boost your recurring revenue and valuation.");
  }

  // User base recommendations
  if (parseInt(metrics.activeUsers) < 1000) {
    recommendations.push("Prioritize user acquisition and retention strategies to build a more valuable customer base.");
  }

  // Growth-based recommendations
  if (parseInt(metrics.growthRate) < 20) {
    recommendations.push("Explore new market segments or product features to accelerate your growth rate and increase valuation.");
  }

  // Market trend recommendations
  if (metrics.marketTrend === 'declining') {
    recommendations.push("Consider pivoting to adjacent market segments with stronger growth trends to improve valuation outlook.");
  } else if (metrics.marketTrend === 'emerging') {
    recommendations.push("Document your first-mover advantage and market leadership position to maximize valuation.");
  }

  return recommendations;
};
