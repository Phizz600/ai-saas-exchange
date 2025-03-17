
// URL utilities for authentication flows

/**
 * Get the current URL for use in the redirectTo
 * @returns {string} The full URL origin with /auth path
 */
export const getRedirectUrl = () => {
  // Get the full URL without any query parameters or hash
  const url = new URL(window.location.href);
  return `${url.origin}/auth`;
};
