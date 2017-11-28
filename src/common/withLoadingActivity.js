// @flow

import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

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
        <View style={[styles.container, containerStyle]}>
          <ActivityIndicator size={activitySize} />
        </View>
      ) : (
        <Component {...this.props} />
      );
    }
  }

  hoistNonReactStatic(WithLoadingActivity, Component);
  return WithLoadingActivity;
};

export default withLoadingActivity;
