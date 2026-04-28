import { Image } from 'expo-image';

const clearBrewskeyExpoImageCaches = async (): Promise<void> => {
  try {
    await Image.clearMemoryCache();
  } catch {
    // best-effort
  }
  try {
    await Image.clearDiskCache();
  } catch {
    // best-effort
  }
};

export { clearBrewskeyExpoImageCaches };
