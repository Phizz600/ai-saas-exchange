
import { supabase } from '../client';

/**
 * Validates if a string is a valid UUID
 * @param uuid String to validate
 * @returns Boolean indicating if string is a valid UUID
 */
export const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
