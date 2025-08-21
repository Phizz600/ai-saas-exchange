
// URL utilities for authentication flows

/**
 * Get the current URL for use in the redirectTo
 * @returns {string} The full URL origin with /auth path
 */
export const getRedirectUrl = () => {
  // Always use the production domain for OAuth redirects
  // This ensures consistent branding in OAuth consent screens
  const isProd = window.location.hostname === 'aiexchange.club';
  const baseUrl = isProd ? 'https://aiexchange.club' : window.location.origin;
  return `${baseUrl}/auth?type=recovery`;
};
