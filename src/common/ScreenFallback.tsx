import * as React from 'react';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { LoadingIndicator } from 'common/LoadingIndicator';

export interface ScreenFallbackProps {
  /** Optional header title. When omitted, header still renders with no title. */
  title?: string | null;
  /** Show back button in header. Default false. */
  shouldShowBackButton?: boolean;
  testID?: string;
}

/**
 * Full-page loading fallback for Suspense (and temporary non-Suspense screens).
 * Renders Container + optional Header + centered LoadingIndicator.
 */
export const ScreenFallback: React.FC<ScreenFallbackProps> = ({
  shouldShowBackButton = false,
  testID,
  title,
}) => (
  <Container testID={testID}>
    <Header
      shouldShowBackButton={shouldShowBackButton}
      testID={testID ? `${testID}-header` : undefined}
      title={title}
    />
    <LoadingIndicator testID={testID ? `${testID}-loading` : undefined} />
  </Container>
);
