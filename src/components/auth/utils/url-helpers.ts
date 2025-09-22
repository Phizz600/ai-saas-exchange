
// URL utilities for authentication flows

/**
 * Get the current URL for use in the redirectTo
 * @returns {string} The full URL origin with /auth path
 */
export const getRedirectUrl = () => {
  // Use the current origin for OAuth redirects to avoid SSL certificate issues
  // This ensures the redirect works regardless of domain configuration
  return `${window.location.origin}/auth?type=recovery`;
};
