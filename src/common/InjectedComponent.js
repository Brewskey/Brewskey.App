// @flow

import * as React from 'react';

class InjectedComponent<
  TInjectedProps,
  TProps = {},
  TState = void,
> extends React.Component<TProps, TState> {
  get injectedProps(): TInjectedProps {
    return ((this.props: any): TInjectedProps);
  }
}

export default InjectedComponent;
