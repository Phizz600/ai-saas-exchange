
export const calculateValuation = (
  mrr: number,
  churnRate: number,
  grossMargin: number,
  industry: string,
  hasPatents: boolean,
  monthlyRevenue?: number,
  previousMonthRevenue?: number,
  customerAcquisitionCost?: number
): { low: number; high: number } => {
  // Base multiples
  const revenueMultipleLow = 4;
  const revenueMultipleHigh = 8;

  // Calculate growth rate if we have both current and previous month revenue
  let growthRate = 0;
  if (monthlyRevenue && previousMonthRevenue && previousMonthRevenue > 0) {
    growthRate = (monthlyRevenue - previousMonthRevenue) / previousMonthRevenue;
  }

  // Growth factor
  let growthFactor = 1.0;
  if (growthRate > 0.15) {
    growthFactor = 1.4;
  } else if (growthRate > 0.1) {
    growthFactor = 1.3;
  } else if (growthRate > 0.05) {
    growthFactor = 1.1;
  }

  // Margin factor
  let marginFactor = 0.9;
  if (grossMargin > 0.8) {
    marginFactor = 1.2;
  } else if (grossMargin > 0.7) {
    marginFactor = 1.1;
  } else if (grossMargin > 0.5) {
    marginFactor = 1.0;
  }

  // Risk factor based on churn
  let riskFactor = 0.9;
  if (churnRate < 0.02) {
    riskFactor = 1.1;
  } else if (churnRate < 0.05) {
    riskFactor = 1.0;
  }

  // Industry multiplier
  const industryMultiplier = ["healthcare", "fintech", "autonomous vehicles"].includes(industry.toLowerCase())
    ? 1.2
    : 1.0;

  // IP multiplier
  const ipMultiplier = hasPatents ? 1.1 : 1.0;

  // CAC efficiency factor
  let cacFactor = 1.0;
  if (customerAcquisitionCost && mrr > 0) {
    const monthsToRecoup = customerAcquisitionCost / (mrr * grossMargin);
    if (monthsToRecoup < 6) {
      cacFactor = 1.2; // Very efficient CAC
    } else if (monthsToRecoup < 12) {
      cacFactor = 1.1; // Good CAC
    } else if (monthsToRecoup > 24) {
      cacFactor = 0.8; // Poor CAC
    }
  }

  // Calculate valuation range
  const valuationLow = (mrr * revenueMultipleLow) * growthFactor * marginFactor * riskFactor * industryMultiplier * ipMultiplier * cacFactor;
  const valuationHigh = (mrr * revenueMultipleHigh) * growthFactor * marginFactor * riskFactor * industryMultiplier * ipMultiplier * cacFactor;

  return {
    low: Math.round(valuationLow),
    high: Math.round(valuationHigh)
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
