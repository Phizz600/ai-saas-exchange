
interface BuyerPreferences {
  investment_budget?: string[];
  preferred_categories?: string[];
  revenue_requirements?: string[];
  investment_stage?: string[];
  monetization_preferences?: string[];
  preferred_industries?: string[];
  tech_stack_preferences?: string[];
  investment_timeline?: string[];
}

interface Product {
  id: string;
  title: string;
  price: number;
  monthly_revenue: number;
  category: string;
  stage: string;
  business_model: string;
  industry: string;
  tech_stack: string[];
  status: string;
}

interface MatchResult {
  product: Product;
  score: number;
  matchReasons: string[];
}

export class BuyerMatchingEngine {
  static calculateMatchScore(buyer: BuyerPreferences, product: Product): MatchResult {
    let score = 0;
    const matchReasons: string[] = [];
    const maxScore = 100;

    // Budget matching (25 points)
    const budgetScore = this.calculateBudgetMatch(buyer.investment_budget, product.price);
    score += budgetScore;
    if (budgetScore > 0) {
      matchReasons.push(`Price fits your budget range`);
    }

    // Category matching (20 points)
    const categoryScore = this.calculateCategoryMatch(buyer.preferred_categories, product.category);
    score += categoryScore;
    if (categoryScore > 0) {
      matchReasons.push(`Matches your AI category preference`);
    }

    // Revenue stage matching (20 points)
    const revenueScore = this.calculateRevenueMatch(buyer.revenue_requirements, product.monthly_revenue);
    score += revenueScore;
    if (revenueScore > 0) {
      matchReasons.push(`Revenue stage aligns with your preference`);
    }

    // Development stage matching (15 points)
    const stageScore = this.calculateStageMatch(buyer.investment_stage, product.stage);
    score += stageScore;
    if (stageScore > 0) {
      matchReasons.push(`Development stage matches your criteria`);
    }

    // Business model matching (10 points)
    const modelScore = this.calculateBusinessModelMatch(buyer.monetization_preferences, product.business_model);
    score += modelScore;
    if (modelScore > 0) {
      matchReasons.push(`Business model aligns with your preference`);
    }

    // Industry matching (10 points)
    const industryScore = this.calculateIndustryMatch(buyer.preferred_industries, product.industry);
    score += industryScore;
    if (industryScore > 0) {
      matchReasons.push(`Industry focus matches your interest`);
    }

    return {
      product,
      score: Math.min(score, maxScore),
      matchReasons
    };
  }

  private static calculateBudgetMatch(budgetPrefs: string[] = [], price: number): number {
    if (!budgetPrefs.length) return 0;

    const budget = budgetPrefs[0];
    const budgetRanges = {
      "10k_50k": { min: 10000, max: 50000 },
      "50k_200k": { min: 50000, max: 200000 },
      "200k_1m": { min: 200000, max: 1000000 },
      "1m_plus": { min: 1000000, max: Infinity }
    };

    const range = budgetRanges[budget as keyof typeof budgetRanges];
    if (range && price >= range.min && price <= range.max) {
      return 25;
    }
    return 0;
  }

  private static calculateCategoryMatch(categoryPrefs: string[] = [], productCategory: string): number {
    if (!categoryPrefs.length) return 0;

    const categoryMappings = {
      "nlp": ["natural_language_processing", "nlp", "text_analysis"],
      "content_generation": ["content_generation", "content", "writing"],
      "computer_vision": ["computer_vision", "image_processing", "vision"],
      "data_analytics": ["data_analytics", "analytics", "business_intelligence"],
      "automation": ["automation", "workflow", "process_automation"],
      "voice_speech": ["voice_speech", "audio", "speech_recognition"]
    };

    for (const pref of categoryPrefs) {
      const mappings = categoryMappings[pref as keyof typeof categoryMappings] || [pref];
      if (mappings.some(mapping => productCategory.toLowerCase().includes(mapping))) {
        return 20;
      }
    }
    return 0;
  }

  private static calculateRevenueMatch(revenuePrefs: string[] = [], monthlyRevenue: number): number {
    if (!revenuePrefs.length) return 0;

    const pref = revenuePrefs[0];
    const revenueRanges = {
      "pre_revenue": { min: 0, max: 0 },
      "early_revenue": { min: 1000, max: 10000 },
      "growing_revenue": { min: 10000, max: 50000 },
      "established_revenue": { min: 50000, max: Infinity }
    };

    const range = revenueRanges[pref as keyof typeof revenueRanges];
    if (range && monthlyRevenue >= range.min && monthlyRevenue <= range.max) {
      return 20;
    }
    return 0;
  }

  private static calculateStageMatch(stagePrefs: string[] = [], productStage: string): number {
    if (!stagePrefs.length) return 0;

    const pref = stagePrefs[0];
    if (pref === "any") return 15;

    const stageMappings = {
      "mvp": ["mvp", "early", "prototype"],
      "growth": ["growth", "scaling", "traction"],
      "established": ["established", "mature", "stable"]
    };

    const mappings = stageMappings[pref as keyof typeof stageMappings] || [pref];
    if (mappings.some(mapping => productStage.toLowerCase().includes(mapping))) {
      return 15;
    }
    return 0;
  }

  private static calculateBusinessModelMatch(modelPrefs: string[] = [], businessModel: string): number {
    if (!modelPrefs.length) return 0;

    const pref = modelPrefs[0];
    if (businessModel.toLowerCase().includes(pref)) {
      return 10;
    }
    return 0;
  }

  private static calculateIndustryMatch(industryPrefs: string[] = [], productIndustry: string): number {
    if (!industryPrefs.length) return 0;

    const pref = industryPrefs[0];
    if (pref === "any") return 10;

    if (productIndustry.toLowerCase().includes(pref)) {
      return 10;
    }
    return 0;
  }

  static async findMatches(buyerPreferences: BuyerPreferences, products: Product[]): Promise<MatchResult[]> {
    const matches = products
      .filter(product => product.status === 'active')
      .map(product => this.calculateMatchScore(buyerPreferences, product))
      .filter(match => match.score >= 30) // Only return matches with 30%+ compatibility
      .sort((a, b) => b.score - a.score);

    return matches;
  }

  static async getBuyerMatches(userId: string): Promise<MatchResult[]> {
    // This would be called by the webhook when new products are added
    // For now, it's a placeholder that could be extended
    return [];
  }
}
