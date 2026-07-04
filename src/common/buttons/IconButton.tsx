// the component fixes touchable feedback for react-native-elements Icon
// the current version works only for raised=false icon.
import * as React from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { TouchableItem } from 'common/buttons/TouchableItem';

import type { StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

// rneui v5 typings dropped the vector-icon props (color/name/size) after the
// vector-icons migration; the runtime still forwards them, so re-add them here.
type Props = React.ComponentProps<typeof Icon> & {
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
  name: string;
  onPress?: () => void | Promise<void>;
  size?: number;
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
