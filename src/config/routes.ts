// Centralized route configuration for consistency across prerendering and sitemap generation

export interface RouteConfig {
  path: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  includeInSitemap: boolean;
  prerenderStatic: boolean;
}

export const ROUTE_CONFIGS: RouteConfig[] = [
  // Public routes
  { path: '/', priority: 1.0, changefreq: 'weekly', includeInSitemap: true, prerenderStatic: true },
  { path: '/ai-saas-quiz', priority: 0.8, changefreq: 'weekly', includeInSitemap: true, prerenderStatic: true },
  { path: '/ai-saas-quiz/submit', priority: 0.8, changefreq: 'weekly', includeInSitemap: true, prerenderStatic: true },
  { path: '/buyer-matching-quiz', priority: 0.8, changefreq: 'weekly', includeInSitemap: true, prerenderStatic: true },
  { path: '/auth', priority: 0.6, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
  { path: '/nda-policy', priority: 0.7, changefreq: 'monthly', includeInSitemap: true, prerenderStatic: true },
  { path: '/faq', priority: 0.8, changefreq: 'weekly', includeInSitemap: true, prerenderStatic: true },
  { path: '/about', priority: 0.7, changefreq: 'monthly', includeInSitemap: true, prerenderStatic: true },
  { path: '/terms', priority: 0.7, changefreq: 'monthly', includeInSitemap: true, prerenderStatic: true },
  { path: '/policies', priority: 0.7, changefreq: 'monthly', includeInSitemap: true, prerenderStatic: true },
  { path: '/contact', priority: 0.7, changefreq: 'monthly', includeInSitemap: true, prerenderStatic: true },
  { path: '/fees-pricing', priority: 0.8, changefreq: 'monthly', includeInSitemap: true, prerenderStatic: true },
  { path: '/auth-test', priority: 0.3, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
  { path: '/diagnostics', priority: 0.3, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
  { path: '/private-partners-program', priority: 0.7, changefreq: 'monthly', includeInSitemap: true, prerenderStatic: true },
  
  // Protected routes (prerender for loading states but exclude from sitemap)
  { path: '/onboarding-redirect', priority: 0.5, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
  { path: '/product-dashboard', priority: 0.6, changefreq: 'weekly', includeInSitemap: false, prerenderStatic: true },
  { path: '/profile', priority: 0.5, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
  { path: '/messages', priority: 0.5, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
  { path: '/settings', priority: 0.4, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
  { path: '/list-product', priority: 0.6, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
  { path: '/admin', priority: 0.3, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
  { path: '/listing-thank-you', priority: 0.4, changefreq: 'monthly', includeInSitemap: false, prerenderStatic: true },
];

// Utility functions
export const getStaticRoutes = () => ROUTE_CONFIGS.filter(route => route.prerenderStatic);
export const getSitemapRoutes = () => ROUTE_CONFIGS.filter(route => route.includeInSitemap);
export const getPublicRoutes = () => ROUTE_CONFIGS.filter(route => route.includeInSitemap);