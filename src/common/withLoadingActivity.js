// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { ActivityIndicator } from 'react-native';

const Container = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
`;

type IsLoadingSelector<TProps> = (props: TProps) => boolean;

const withLoadingActivity = <TProps: {}>(
  isLoadingSelector?: IsLoadingSelector<TProps> = ({
    entityLoader,
  }: Object): boolean => entityLoader.isLoading(),
  activitySize?: 'small' | 'large' | number = 'large',
  containerStyle?: Object,
) => (
  Component: React.ComponentType<TProps>,
): Class<React.Component<TProps>> => {
  class WithLoadingActivity extends React.Component<TProps> {
    render() {
      const isLoading = isLoadingSelector(this.props);
      return isLoading ? (
        <Container style={containerStyle}>
          <ActivityIndicator size={activitySize} />
        </Container>
      ) : (
        <Component {...this.props} />
      );
    }
  }

  hoistNonReactStatic(WithLoadingActivity, Component);
  return WithLoadingActivity;
};

export default withLoadingActivity;
