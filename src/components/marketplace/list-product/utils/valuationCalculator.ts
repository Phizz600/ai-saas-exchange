
import * as tf from '@tensorflow/tfjs';

// Training data (simplified example)
const trainingData = {
  features: [
    [10000, 0.03, 1], // MRR, Churn, Industry (1 = healthcare)
    [5000, 0.05, 0],
    [20000, 0.02, 1],
    [15000, 0.04, 0],
    [25000, 0.01, 1]
  ],
  labels: [6.5, 4.0, 8.0, 5.5, 7.5] // Revenue multiples
};

// Create and train the model
const createModel = async () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [3] }));
  
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError'
  });

  const xs = tf.tensor2d(trainingData.features);
  const ys = tf.tensor1d(trainingData.labels);

  await model.fit(xs, ys, {
    epochs: 100,
    verbose: 0
  });

  return model;
};

// Cache the model
let cachedModel: tf.LayersModel | null = null;

const predictRevenueMultiple = async (
  mrr: number,
  churnRate: number,
  industry: string
): Promise<number> => {
  if (!cachedModel) {
    cachedModel = await createModel();
  }

  const industryCode = ["healthcare", "fintech", "autonomous vehicles"].includes(industry.toLowerCase()) ? 1 : 0;
  const input = tf.tensor2d([[mrr, churnRate, industryCode]]);
  
  const prediction = await cachedModel.predict(input) as tf.Tensor;
  const multiple = (await prediction.data())[0];
  
  // Cleanup
  input.dispose();
  prediction.dispose();

  return Math.max(4, Math.min(8, multiple)); // Clamp between 4-8x
};

export const calculateValuation = async (
  mrr: number,
  churnRate: number,
  grossMargin: number,
  industry: string,
  hasPatents: boolean,
  monthlyRevenue?: number,
  previousMonthRevenue?: number,
  customerAcquisitionCost?: number
): Promise<{ low: number; high: number }> => {
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

  // Get AI-predicted revenue multiple
  const revenueMultiple = await predictRevenueMultiple(mrr, churnRate, industry);

  // Calculate valuation range using AI-predicted multiple
  const valuationLow = (mrr * revenueMultiple * 0.9) * growthFactor * marginFactor * riskFactor * ipMultiplier * cacFactor;
  const valuationHigh = (mrr * revenueMultiple * 1.1) * growthFactor * marginFactor * riskFactor * ipMultiplier * cacFactor;

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
