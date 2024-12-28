import * as React from 'react';
import { StyleSheet } from 'react-native';
import TouchableItem from '../../common/buttons/TouchableItem';
import { COLORS } from '../../theme';
import { Icon } from '@rneui/themed';
import { NavigationRoute, ParamListBase } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

type Props = {
  icon: {
    name: string;
    type?: string;
  };
  iconContainerComponent?: React.ComponentType<TouchableItem['props']>;
  isFocused: boolean;
  onPress: (
    route: NavigationRoute<ParamListBase, string>,
    isFocused: boolean,
  ) => void;
  route: NavigationRoute<ParamListBase, string>;
};

export const TabBarButton = (props: Props) => {
  const _onPress = () => props.onPress(props.route, props.isFocused);

  const {
    icon: { name, type },
    iconContainerComponent = TouchableItem,
    isFocused,
  } = props;

  return (
    <Icon
      color={isFocused ? COLORS.primary2 : COLORS.secondary3}
      Component={iconContainerComponent}
      containerStyle={styles.container}
      name={name}
      onPress={_onPress}
      type={type}
    />
  );
};
