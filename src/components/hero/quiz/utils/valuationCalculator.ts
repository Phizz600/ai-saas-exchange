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
  confidenceScore: number;
  metrics: {
    revenueScore: number;
    growthScore: number;
    marketScore: number;
    userScore: number;
    overallScore: number;
  };
  improvementAreas: {
    area: string;
    currentScore: number;
    targetScore: number;
    actionItems: string[];
  }[];
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

  // Calculate detailed metrics scores (0-100)
  const revenueScore = calculateRevenueScore(monthlyRevenue);
  const growthScore = calculateGrowthScore(parseInt(growthRate));
  const marketScore = calculateMarketScore(marketTrend, aiCategory);
  const userScore = calculateUserScore(parseInt(activeUsers));
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (revenueScore * 0.3) + 
    (growthScore * 0.3) + 
    (marketScore * 0.2) + 
    (userScore * 0.2)
  );

  // Identify improvement areas
  const improvementAreas = identifyImprovementAreas({
    revenueScore,
    growthScore,
    marketScore,
    userScore,
    monthlyRevenue,
    growthRate,
    marketTrend,
    activeUsers,
    aiCategory
  });

  // Generate category-specific insights
  const insights = generateInsights({
    monthlyRevenue,
    aiCategory,
    activeUsers,
    growthRate,
    marketTrend,
    hasPatents,
    valuation: enhancedValuation,
    metrics: {
      revenueScore,
      growthScore,
      marketScore,
      userScore,
      overallScore
    }
  });

  // Generate category-specific recommendations
  const recommendations = generateRecommendations({
    monthlyRevenue,
    aiCategory,
    activeUsers,
    growthRate,
    marketTrend,
    improvementAreas
  });

  return {
    estimatedValue: enhancedValuation,
    insights,
    recommendations,
    confidenceScore,
    metrics: {
      revenueScore,
      growthScore,
      marketScore,
      userScore,
      overallScore
    },
    improvementAreas
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

// New helper functions for detailed scoring
const calculateRevenueScore = (monthlyRevenue: number): number => {
  if (monthlyRevenue >= 500000) return 100;
  if (monthlyRevenue >= 100000) return 90;
  if (monthlyRevenue >= 50000) return 80;
  if (monthlyRevenue >= 10000) return 60;
  if (monthlyRevenue >= 5000) return 40;
  return 20;
};

const calculateGrowthScore = (growthRate: number): number => {
  if (growthRate >= 100) return 100;
  if (growthRate >= 50) return 90;
  if (growthRate >= 30) return 80;
  if (growthRate >= 20) return 60;
  if (growthRate >= 10) return 40;
  return 20;
};

const calculateMarketScore = (marketTrend: string, aiCategory: string): number => {
  let score = 0;
  
  // Market trend score
  switch (marketTrend) {
    case 'emerging': score += 50; break;
    case 'growing': score += 40; break;
    case 'stable': score += 30; break;
    case 'declining': score += 20; break;
  }
  
  // AI category score
  switch (aiCategory) {
    case 'nlp': score += 50; break;
    case 'cv': score += 40; break;
    case 'ml': score += 35; break;
    case 'automation': score += 30; break;
    default: score += 25;
  }
  
  return score;
};

const calculateUserScore = (activeUsers: number): number => {
  if (activeUsers >= 100000) return 100;
  if (activeUsers >= 10000) return 90;
  if (activeUsers >= 1000) return 70;
  if (activeUsers >= 100) return 50;
  return 30;
};

const identifyImprovementAreas = (metrics: any): Array<{area: string; currentScore: number; targetScore: number; actionItems: string[]}> => {
  const areas = [];
  
  // Revenue improvement area
  if (metrics.revenueScore < 80) {
    areas.push({
      area: 'Revenue Growth',
      currentScore: metrics.revenueScore,
      targetScore: 80,
      actionItems: generateRevenueActionItems(metrics.monthlyRevenue, metrics.aiCategory)
    });
  }
  
  // Growth improvement area
  if (metrics.growthScore < 80) {
    areas.push({
      area: 'Growth Rate',
      currentScore: metrics.growthScore,
      targetScore: 80,
      actionItems: generateGrowthActionItems(metrics.growthRate, metrics.aiCategory)
    });
  }
  
  // Market improvement area
  if (metrics.marketScore < 80) {
    areas.push({
      area: 'Market Position',
      currentScore: metrics.marketScore,
      targetScore: 80,
      actionItems: generateMarketActionItems(metrics.marketTrend, metrics.aiCategory)
    });
  }
  
  // User base improvement area
  if (metrics.userScore < 80) {
    areas.push({
      area: 'User Base',
      currentScore: metrics.userScore,
      targetScore: 80,
      actionItems: generateUserActionItems(metrics.activeUsers, metrics.aiCategory)
    });
  }
  
  return areas;
};

const generateRevenueActionItems = (monthlyRevenue: number, aiCategory: string): string[] => {
  const actions = [];
  
  if (monthlyRevenue < 10000) {
    actions.push("Implement a tiered pricing strategy to increase average revenue per user");
    actions.push("Focus on upselling existing customers with premium features");
    actions.push("Develop enterprise-specific features to target larger clients");
  }
  
  if (aiCategory === 'nlp') {
    actions.push("Offer specialized NLP models for high-value industries (healthcare, finance)");
  } else if (aiCategory === 'automation') {
    actions.push("Create industry-specific automation packages with premium pricing");
  }
  
  return actions;
};

const generateGrowthActionItems = (growthRate: number, aiCategory: string): string[] => {
  const actions = [];
  
  if (growthRate < 30) {
    actions.push("Implement a referral program to accelerate user acquisition");
    actions.push("Optimize your marketing funnel for better conversion rates");
    actions.push("Explore strategic partnerships in your industry");
  }
  
  if (aiCategory === 'nlp') {
    actions.push("Leverage AI-generated content to improve SEO and organic growth");
  } else if (aiCategory === 'cv') {
    actions.push("Target high-growth sectors like security and healthcare");
  }
  
  return actions;
};

const generateMarketActionItems = (marketTrend: string, aiCategory: string): string[] => {
  const actions = [];
  
  if (marketTrend === 'declining') {
    actions.push("Pivot to adjacent market segments with stronger growth trends");
    actions.push("Develop new features that address emerging market needs");
  }
  
  if (aiCategory === 'nlp') {
    actions.push("Position your solution as an enterprise-grade AI platform");
    actions.push("Develop industry-specific use cases and success stories");
  }
  
  return actions;
};

const generateUserActionItems = (activeUsers: number, aiCategory: string): string[] => {
  const actions = [];
  
  if (activeUsers < 1000) {
    actions.push("Implement a freemium model to accelerate user acquisition");
    actions.push("Focus on viral growth features and social sharing");
    actions.push("Develop a community around your product");
  }
  
  if (aiCategory === 'automation') {
    actions.push("Create industry-specific templates and workflows");
    actions.push("Develop integration partnerships with popular tools");
  }
  
  return actions;
};
