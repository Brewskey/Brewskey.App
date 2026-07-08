/**
 * Real-API mode helpers (REAL_API=1).
 *
 * Instead of Playwright route mocks, tests run against the actual
 * Brewskey.Web Docker image (tests/e2e-stack/docker-compose.yml). These
 * helpers seed state through the real API: user registration via
 * POST /api/Account/Register and token issuance via the /token/ password
 * grant, translated to the same AuthResponse shape @brewskey/js-api's
 * reformatLoginResponse produces (what the app persists in Storage).
 */
import { APIRequestContext } from '@playwright/test';
import type { Account, AuthResponse } from '@brewskey/js-api';

export const REAL_API = Boolean(process.env.REAL_API);

export const REAL_API_HOST =
  process.env.EXPO_PUBLIC_API_HOST ?? 'http://localhost:8080';

let uniqueCounter = 0;

/** Unique-per-run credentials so a reused stack database never collides. */
export const uniqueUserName = (base = 'e2euser'): string => {
  uniqueCounter += 1;
  return `${base}${Date.now().toString(36)}${uniqueCounter}`;
};

export const DEFAULT_E2E_PASSWORD = 'E2e_Pass1!';

export type RealUser = {
  userName: string;
  email: string;
  password: string;
};

export const registerRealUser = async (
  request: APIRequestContext,
  overrides: Partial<RealUser> = {},
): Promise<RealUser> => {
  // Always unique-suffix (a requested name becomes the prefix): the stack's
  // database persists across tests in a run, so exact reuse would collide on
  // the duplicate-user check.
  const userName = uniqueUserName(overrides.userName ?? 'e2euser');
  const user: RealUser = {
    userName,
    email: overrides.email ?? `${userName}@brewskey.test`,
    password: overrides.password ?? DEFAULT_E2E_PASSWORD,
  };

  const response = await request.post(`${REAL_API_HOST}/api/Account/Register`, {
    data: {
      email: user.email,
      userName: user.userName,
      password: user.password,
    },
  });

  if (!response.ok()) {
    throw new Error(
      `Real-API register failed (${response.status()}): ${await response.text()}`,
    );
  }

  return user;
};

/**
 * Password-grant login, translated exactly like js-api's
 * reformatLoginResponse so the stored session matches what the app writes
 * after a real login.
 */
export const loginRealUser = async (
  request: APIRequestContext,
  user: Pick<RealUser, 'userName' | 'password'>,
): Promise<AuthResponse> => {
  const response = await request.post(`${REAL_API_HOST}/token/`, {
    form: {
      grant_type: 'password',
      username: user.userName,
      password: user.password,
    },
  });

  if (!response.ok()) {
    throw new Error(
      `Real-API login failed (${response.status()}): ${await response.text()}`,
    );
  }

  const raw = await response.json();
  return {
    ...raw,
    accessToken: raw.access_token,
    expiresAt: raw['.expires'],
    expiresIn: raw.expires_in,
    issuedAt: raw['.issued'],
    isNewAccount: raw.isNewAccount === true || raw.isNewAccount === 'true',
    refreshToken: raw.refresh_token,
    roles: raw.roles ? JSON.parse(raw.roles) : [],
    tokenType: raw.token_type,
    userLogins: raw.userLogins ? JSON.parse(raw.userLogins) : [],
  } as AuthResponse;
};

/** Register + login in one step; returns the app-shaped session. */
export const seedRealAuthenticatedUser = async (
  request: APIRequestContext,
  overrides: Partial<RealUser> & Partial<Account> = {},
): Promise<{ user: RealUser; authResponse: AuthResponse }> => {
  const user = await registerRealUser(request, {
    userName: overrides.userName as string | undefined,
    email: overrides.email as string | undefined,
    password: (overrides as Partial<RealUser>).password,
  });
  const authResponse = await loginRealUser(request, user);
  return { user, authResponse };
};
