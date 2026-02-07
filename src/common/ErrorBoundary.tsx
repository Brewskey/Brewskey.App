import { PureComponent } from 'react';

import { getElementFromComponentProp } from 'utils';

import type { ComponentType, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackComponent: ReactNode | null | undefined | ComponentType;
}

interface State {
  error: Error | null | undefined;
}

/**
 * React Error Boundary for scoped error handling (e.g. wrapping a list so the rest
 * of the screen still works). Layout-level errors are handled by Expo Router's
 * ErrorBoundary export and RouteErrorFallback; use this class only when you need
 * a boundary around a subtree. Pass fallbackComponent (e.g. ErrorScreen or a
 * custom fallback) to render when an error is caught.
 */
export class ErrorBoundary extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error);
    // eslint-disable-next-line no-console
    console.error('Error info:', errorInfo);
    // eslint-disable-next-line no-console
    console.error('Error stack:', error.stack);
    this.setState(() => ({ error }));
  }

  render(): React.ReactNode {
    const { fallbackComponent, children } = this.props;
    const { error } = this.state;

    if (error) {
      return getElementFromComponentProp(fallbackComponent) ?? null;
    }
    return children;
  }
}
