interface ErrorPayload {
  ModelState?: Record<string, string[]>;
  Message?: string;
  error?: unknown;
  error_description?: string;
  message?: string;
  params?: unknown;
}

const DEFAULT_ERROR_MESSAGE =
  "Whoa! Brewskey had an error. We'll try to get it fixed soon.";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseModelState = (modelState: Record<string, string[]>): string => {
  let resultErrorMessage = '';
  Array.from(Object.values(modelState)).forEach((fieldErrorArray) => {
    if (Array.isArray(fieldErrorArray)) {
      new Set(fieldErrorArray).forEach((fieldError: string) => {
        resultErrorMessage = `${resultErrorMessage}\n${fieldError}`;
      });
    }
  });

  return resultErrorMessage;
};

export const parseError = (
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGE,
): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (isRecord(error)) {
    const errorObj = error as ErrorPayload;

    if (errorObj.ModelState) {
      return parseModelState(errorObj.ModelState);
    }

    if (errorObj.error_description) {
      return errorObj.error_description;
    }

    if (errorObj.Message) {
      return errorObj.Message;
    }

    if (errorObj.message) {
      return errorObj.message;
    }

    if (typeof errorObj.error === 'string') {
      return errorObj.error;
    }

    if (isRecord(errorObj.error)) {
      const parsedNestedError = parseError(errorObj.error, '');
      if (parsedNestedError) {
        return parsedNestedError;
      }
    }

    if (isRecord(errorObj.params)) {
      const parsedParamsError = parseError(errorObj.params, '');
      if (parsedParamsError) {
        return parsedParamsError;
      }
    }
  }

  return fallback;
};

/**
 * Response body attached by `@brewskey/js-api` `fetch` on HTTP error responses.
 */
export const getFetchErrorBody = (error: unknown): unknown => {
  if (isRecord(error) && 'body' in error) {
    return (error as { body: unknown }).body;
  }
  return undefined;
};

/** `error` field from a JSON API error body, when present. */
export const getApiErrorCode = (error: unknown): string | undefined => {
  const body = getFetchErrorBody(error);
  if (isRecord(body) && typeof body.error === 'string') {
    return body.error;
  }
  return undefined;
};

/**
 * Prefer parsing the API error body (when `fetch` attached it); otherwise
 * fall back to generic `parseError` on the thrown value.
 */
export const formatErrorForUser = (
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGE,
): string => {
  const body = getFetchErrorBody(error);
  if (body != null && body !== '') {
    const fromBody = parseError(body, '');
    if (fromBody) {
      return fromBody;
    }
  }
  return parseError(error, fallback);
};
