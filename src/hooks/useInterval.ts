import * as React from 'react';

// Self-correcting setInterval that always uses the latest callback closure.
// Pass `delay = null` to pause the interval. Mirrors the API of
// `usehooks-ts`'s `useInterval` so callers can swap without changes.
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay == null) {
      return undefined;
    }
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
