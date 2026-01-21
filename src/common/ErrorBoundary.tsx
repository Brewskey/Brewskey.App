import * as React from 'react';
import { getElementFromComponentProp } from '../utils';

type Props = {
  children: React.ReactNode;
  fallbackComponent: React.ReactNode | null | undefined | React.ComponentType;
};

type State = {
  error: Error | null | undefined;
};

export class ErrorBoundary extends React.PureComponent<Props, State> {
  state: State = {
    error: null,
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    console.error('Error stack:', error.stack);
    this.setState(() => ({ error }));
  }

  render() {
    const { fallbackComponent } = this.props;

    if (this.state.error) {
      return getElementFromComponentProp(fallbackComponent) ?? null;
    }
    return this.props.children;
  }
}

export const withErrorBoundary = <
  TProps extends Record<string, unknown>,
  TComponent extends React.ComponentType<TProps>,
>(
  Component: React.ComponentType<TProps>,
  fallbackComponent: React.ReactNode | null | undefined | React.ComponentType,
): TComponent => {
  const WithErrorBoundary = React.memo((props: TProps): React.ReactElement => {
    return (
      <ErrorBoundary fallbackComponent={fallbackComponent}>
        <Component {...props} />
      </ErrorBoundary>
    );
  });

  return WithErrorBoundary as unknown as TComponent;
};

export const errorBoundary =
   
  <TComponent extends React.ComponentClass<any, any>>(
    fallbackComponent?: React.ReactNode | React.ComponentType,
  ): ((c: TComponent) => TComponent) =>
  (Component: TComponent): TComponent =>
    withErrorBoundary(Component, fallbackComponent);
