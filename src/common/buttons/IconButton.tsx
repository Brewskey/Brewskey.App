// the component fixes touchable feedback for react-native-elements Icon
// the current version works only for raised=false icon.
import { Icon } from '@rneui/themed';

import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import TouchableItem from './TouchableItem';

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
  <TouchableItem shouldBeBorderless onPress={onPress} style={containerStyle} testID={testID}>
    <Icon {...rest} containerStyle={styles.container} />
  </TouchableItem>
);

export default IconButton;
