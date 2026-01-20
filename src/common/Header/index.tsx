import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY, getElevationStyle } from '../../theme';
import HeaderBackButton from './HeaderBackButton';
import { getElementFromComponentProp } from '../../utils';
import { ListComponentTypes } from '../List';

// todo title have slight offset to the left when there are more than one
// button in the right component. Need to figure better solution to position
// components inside header, to be able to keep title in the center always.
const styles = StyleSheet.create({
  fakeHeaderButton: {
    height: 24,
    width: 44,
  },
  innerContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  outerContainer: {
    ...getElevationStyle(1),
    backgroundColor: COLORS.primary2,
    height: 60,
    overflow: 'visible',
    paddingHorizontal: 12,
  },
  title: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
});

const FakeHeaderButton = () => <View style={styles.fakeHeaderButton} />;

type Props = {
  leftComponent?: ListComponentTypes;
  rightComponent?: ListComponentTypes;
  showBackButton?: boolean;
  shouldShowBackButton?: boolean;
  title?: string | null | undefined;
  testID?: string;
};

const Header: React.FC<Props> = ({
  leftComponent = <FakeHeaderButton />,
  rightComponent = <FakeHeaderButton />,
  showBackButton,
  shouldShowBackButton,
  title,
  testID,
}) => {
  const shouldShow = showBackButton || shouldShowBackButton;
  const leftElement = shouldShow ? (
    <HeaderBackButton />
  ) : (
    getElementFromComponentProp(leftComponent)
  );

  const rightElement = getElementFromComponentProp(rightComponent);

  return (
    <View style={styles.outerContainer} testID={testID}>
      <StatusBar backgroundColor={COLORS.primary3} />
      <View style={styles.innerContainer}>
        {leftElement}
        <View style={styles.titleContainer} testID={`${testID}-title`}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>
        {rightElement}
      </View>
    </View>
  );
};

export default React.memo(Header);
