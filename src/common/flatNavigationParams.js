// @flow

import * as React from 'react';

// todo fix following eslint error
/* eslint-disable react/display-name */
const flatNavigationParams = <TProps: { navigation: Object }>(
  Component: React.ComponentType<TProps>,
): React.StatelessComponent<TProps> => (
  props: TProps,
): React.Element<Component> => (
  <Component {...props} {...props.navigation.state.params || {}} />
);

export default flatNavigationParams;
