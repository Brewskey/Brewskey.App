/**
 * Verifies the real-API stack is reachable before any test runs, so a
 * missing stack fails fast with instructions instead of 60 timeouts.
 */
import { CLOUD_ADMIN_TOKEN, CLOUD_HOST } from '../fixtures/seed-api';

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

  // The device cloud must be up AND recognize the seeded admin token —
  // device seeding provisions every device there.
  try {
    const response = await fetch(`${CLOUD_HOST}/v1/devices`, {
      headers: { Authorization: `Bearer ${CLOUD_ADMIN_TOKEN}` },
    });
    if (!response.ok) {
      throw new Error(`GET /v1/devices returned ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `The device cloud is not reachable at ${CLOUD_HOST} or the admin ` +
        `token is not seeded (${(error as Error).message}). The stack was ` +
        'likely started before the devicecloud service existed — recreate ' +
        'it with:\n\n' +
        '  npm run e2e-stack:down && npm run e2e-stack:up\n',
    );
  }
}
