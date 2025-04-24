
/**
 * Utility functions for error detection and monitoring
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Test the authentication state and connection
 */
export async function testAuthConnection(): Promise<{
  isConnected: boolean;
  authStatus: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Auth connection error:", error);
      return {
        isConnected: false,
        authStatus: "error",
        error: error.message,
      };
    }

    return {
      isConnected: true,
      authStatus: data.session ? "authenticated" : "unauthenticated",
    };
  } catch (err) {
    console.error("Unexpected auth error:", err);
    return {
      isConnected: false,
      authStatus: "error",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<{
  isConnected: boolean;
  error?: string;
}> {
  try {
    // Simple health check query
    const { data, error } = await supabase.from('products').select('count()', { count: 'exact' }).limit(1);
    
    if (error) {
      console.error("Database connection error:", error);
      return {
        isConnected: false,
        error: error.message,
      };
    }

    return {
      isConnected: true,
    };
  } catch (err) {
    console.error("Unexpected database error:", err);
    return {
      isConnected: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Monitor React render performance
 * @param componentName Name of the component being monitored
 */
export function monitorRenderPerformance(componentName: string): () => void {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Log slow renders (over 50ms)
    if (renderTime > 50) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
  };
}

/**
 * Global error handler for uncaught errors
 */
export function setupGlobalErrorHandlers() {
  // Only setup once
  if ((window as any).__errorHandlersInitialized) return;
  
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Check for accessibility or React-specific warnings
    const errorText = args.join(' ');
    if (errorText.includes('DialogContent requires')) {
      console.warn('Accessibility warning: DialogContent requires aria-labelledby or aria-label');
    }
    
    // Call original console.error
    originalConsoleError.apply(console, args);
  };
  
  (window as any).__errorHandlersInitialized = true;
}

/**
 * Runs all diagnostic tests and returns results
 */
export async function runDiagnostics(): Promise<{
  auth: { isConnected: boolean; authStatus: string; error?: string };
  database: { isConnected: boolean; error?: string };
  performanceIssues: string[];
}> {
  const performanceIssues: string[] = [];
  
  // Start monitoring performance
  const recordPerformance = (issue: string) => {
    performanceIssues.push(issue);
  };
  
  // Check React render performance
  if (performance.now() > 5000 && document.readyState === 'complete') {
    const mainContentLoadTime = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (mainContentLoadTime && mainContentLoadTime.domContentLoadedEventEnd > 3000) {
      recordPerformance(`Slow initial page load: ${mainContentLoadTime.domContentLoadedEventEnd.toFixed(0)}ms`);
    }
  }
  
  // Run tests
  const auth = await testAuthConnection();
  const database = await testDatabaseConnection();
  
  return {
    auth,
    database,
    performanceIssues
  };
}
