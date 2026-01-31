import * as React from 'react';

import { Badge } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import { TouchableItem } from 'common/buttons/TouchableItem';
import { COLORS } from 'theme';

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.primary2,
    borderColor: COLORS.secondary,
    borderWidth: 1,
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

type Props = React.ComponentProps<typeof TouchableItem> & {
  children?: React.ReactNode;
  badgeCount: number;
};

const BadgeContainer: React.FC<Props> = ({
  children,
  badgeCount,
  ...props
}) => (
  <TouchableItem {...props}>
    <View>
      {children}
      {badgeCount === 0 ? null : (
        <View style={styles.container}>
          <Badge
            badgeStyle={styles.badge}
            textStyle={styles.badgeText}
            value={badgeCount > 99 ? '99+' : badgeCount}
          />
        </View>
      )}
    </View>
  </TouchableItem>
);

export { BadgeContainer };
