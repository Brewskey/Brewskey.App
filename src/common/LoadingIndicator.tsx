import * as React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

type Props = {
  activitySize?: 'small' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const LoadingContainer = ({
  activitySize = 'large',
  color,
  style,
  testID,
}: Props): React.ReactElement => (
  <View style={style || styles.container} testID={testID}>
    <ActivityIndicator color={color} size={activitySize} />
  </View>
);

export default LoadingContainer;
