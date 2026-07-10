/**
 * Verifies the real-API stack is reachable before any test runs, so a
 * missing stack fails fast with instructions instead of 60 timeouts.
 */
const API_HOST = process.env.EXPO_PUBLIC_API_HOST ?? 'http://localhost:8080';

export default async function globalSetup(): Promise<void> {
  try {
    const response = await fetch(`${API_HOST}/health`);
    if (!response.ok) {
      throw new Error(`health returned ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `The e2e API stack is not reachable at ${API_HOST} ` +
        `(${(error as Error).message}). Start it with:\n\n` +
        '  npm run e2e-stack:up\n',
    );
  }
}
