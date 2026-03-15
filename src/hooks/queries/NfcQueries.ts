import { useMutation } from '@tanstack/react-query';

import { CONFIG } from 'config';

import type { UseMutationResult } from '@tanstack/react-query';

export interface CreateNfcTagAuthorizationResponse {
  token: string;
}

/**
 * POST /api/authorizations/nfc-tag/ with Bearer token.
 * Call with accessToken after Auth.login for the write-nfc or HCE pour flow.
 */
export function useCreateNfcTagAuthorization(): UseMutationResult<
  CreateNfcTagAuthorizationResponse,
  Error,
  string
> {
  return useMutation({
    mutationFn: async (accessToken: string) => {
      const response = await fetch(
        `${CONFIG.HOST}/api/authorizations/nfc-tag/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expiresDate: null,
            useAnonymous: false,
          }),
        },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
      return response.json() as Promise<CreateNfcTagAuthorizationResponse>;
    },
  });
}
