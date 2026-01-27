// the component fixes touchable feedback for react-native-elements Icon
// the current version works only for raised=false icon.
import * as React from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { TouchableItem } from './TouchableItem';

import type { StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

type Props = React.ComponentProps<typeof Icon> & {
  containerStyle?: StyleProp<ViewStyle>;
  name: string;
  onPress?: () => void | Promise<void>;
  testID?: string;
};

// todo fix ripple out of boundaries on raised buttons
const IconButton = ({
  containerStyle,
  onPress,
  testID,
  ...rest
}: Props): React.ReactElement => (
  <TouchableItem
    shouldBeBorderless
    onPress={onPress}
    style={containerStyle}
    testID={testID}
  >
    <Icon {...rest} containerStyle={styles.container} />
  </TouchableItem>
);

export { IconButton };
