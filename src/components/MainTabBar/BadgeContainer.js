// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../theme';
import TouchableItem from '../../common/buttons/TouchableItem';
import { Badge } from 'react-native-elements';

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.primary2,
    borderColor: COLORS.secondary,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 0,
  },
  badgeText: {
    fontSize: 9,
  },
  container: {
    borderColor: COLORS.secondary,
    left: 15,
    position: 'absolute',
    top: -7,
    zIndex: 10,
  },
});

type Props<TouchableItemProps> = {|
  ...TouchableItemProps,
  children?: React.Node,
  badgeCount: number,
|};

class BadgeContainer<TouchableItemProps> extends React.Component<
  Props<TouchableItemProps>,
> {
  render(): React.Node {
    const { children, badgeCount, ...props } = this.props;

    return (
      <TouchableItem {...props}>
        <View>
          {children}
          {badgeCount === 0 ? null : (
            <View style={styles.container}>
              <Badge
                containerStyle={styles.badge}
                textStyle={styles.badgeText}
                value={badgeCount > 99 ? '99+' : badgeCount}
              />
            </View>
          )}
        </View>
      </TouchableItem>
    );
  }
}

export default BadgeContainer;
