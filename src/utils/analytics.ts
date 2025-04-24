
/**
 * Utility functions for handling analytics data transformations
 */

// Simple analytics structure
export interface SimpleAnalytics {
  views: number;
  clicks: number;
  saves: number;
}

// Detailed analytics structure
export interface DetailedAnalytics {
  views: {
    total: number;
    history: Array<{count: number; created_at: any}>;
  };
  bids: {
    total: number;
    active: number;
    history: Array<{amount: any; created_at: any; status: any}>;
  };
  offers: {
    total: number;
    accepted: number;
    declined: number;
    pending: number;
    history: Array<{amount: any; created_at: any; status: any}>;
  };
}

/**
 * Converts detailed analytics to simple analytics format
 */
export function convertToSimpleAnalytics(detailedData: DetailedAnalytics | any): SimpleAnalytics {
  // Handle if we already have simple analytics
  if (
    typeof detailedData?.views === 'number' &&
    typeof detailedData?.clicks === 'number' &&
    typeof detailedData?.saves === 'number'
  ) {
    return detailedData as SimpleAnalytics;
  }
  
  // Extract values from detailed analytics, or use defaults
  const views = typeof detailedData?.views?.total === 'number' 
    ? detailedData.views.total 
    : 0;

  // Default values for clicks and saves
  const clicks = 0; 
  const saves = 0;
  
  return { views, clicks, saves };
}
