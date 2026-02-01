import * as React from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { TouchableItem } from 'common/buttons/TouchableItem';
import { COLORS } from 'theme';

import type { NavigationRoute, ParamListBase } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

interface Props {
  icon: {
    name: string;
    type?: string;
  };
  iconContainerComponent?: React.ComponentType<Record<string, unknown>>;
  isFocused: boolean;
  onPress: (
    route: NavigationRoute<ParamListBase, string>,
    isFocused: boolean,
  ) => void;
  route: NavigationRoute<ParamListBase, string>;
  /** Optional override for testID (e.g. tab-feed, tab-stats). Defaults to tab-${route.name}. */
  testID?: string;
}

export const TabBarButton = (props: Props) => {
  const _onPress = () => props.onPress(props.route, props.isFocused);

  const {
    icon: { name, type },
    iconContainerComponent = TouchableItem,
    isFocused,
  } = props;

  const testID = props.testID ?? `tab-${props.route.name}`;

  return (
    <Icon
      color={isFocused ? COLORS.primary2 : COLORS.secondary3}
      Component={iconContainerComponent as unknown as typeof React.Component}
      containerStyle={styles.container}
      name={name}
      onPress={_onPress}
      testID={testID}
      type={type}
    />
  );
};
