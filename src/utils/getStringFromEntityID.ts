import type { EntityID } from '@brewskey/js-api';

/**
 * Converts an EntityID to a string for use in React Query queryKey values.
 * Returns an empty string for null or undefined.
 */
export function getStringFromEntityID(
  entityId: EntityID | null | undefined,
): string {
  return entityId == null ? '' : String(entityId);
}
