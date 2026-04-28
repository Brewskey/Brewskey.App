import { CONFIG } from 'config';

/**
 * CDN URL for a user's profile image (resized on the server). Caching and
 * invalidation follow HTTP `Cache-Control` on `/cdn/photos/` from the app tier.
 */
const createUserProfileCdnUrl = (userName: string, size: number): string => {
  const trimmed = userName.trim();
  if (!trimmed) {
    return '';
  }
  return `${CONFIG.CDN}photos/${trimmed}.jpg?w=${size}&h=${size}&mode=crop`;
};

export { createUserProfileCdnUrl };
