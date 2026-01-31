import { memo, PureComponent } from 'react';

import { getElementFromComponentProp } from 'utils';

import type {
  ComponentClass,
  ComponentType,
  ErrorInfo,
  ReactElement,
  ReactNode,
} from 'react';

interface Props {
  children: ReactNode;
  fallbackComponent: ReactNode | null | undefined | ComponentType;
}

interface State {
  error: Error | null | undefined;
}

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

export const withErrorBoundary = <
  TProps extends Record<string, unknown>,
  TComponent extends ComponentType<TProps>,
>(
  ComponentToWrap: ComponentType<TProps>,
  fallbackComponent: ReactNode | null | undefined | ComponentType,
): TComponent => {
  const WithErrorBoundary = memo(
    (props: TProps): ReactElement => (
      <ErrorBoundary fallbackComponent={fallbackComponent}>
        <ComponentToWrap {...props} />
      </ErrorBoundary>
    ),
  );

  return WithErrorBoundary as unknown as TComponent;
};

export const errorBoundary =
  <TComponent extends ComponentClass<Record<string, unknown>>>(
    fallbackComponent?: ReactNode | ComponentType,
  ): ((c: TComponent) => TComponent) =>
  (WrappedComponent: TComponent): TComponent =>
    withErrorBoundary(WrappedComponent, fallbackComponent);
