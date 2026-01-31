import * as React from 'react';

import { Animated, StyleSheet, Text, View } from 'react-native';

import { LoadingIndicator } from 'common/LoadingIndicator';
import { useGetKegById } from 'hooks/queries/KegQueries';
import { COLORS, getElevationStyle, TYPOGRAPHY } from 'theme';
import { calculateKegLevel } from 'utils';

import type { EntityID, Keg } from '@brewskey/js-api';

const LOW_KEG_LEVEL = 10;

const styles = StyleSheet.create({
  container: {
    ...getElevationStyle(1),
    backgroundColor: COLORS.secondary,
    height: 50,
    justifyContent: 'center',
  },
  filledBar: {
    backgroundColor: COLORS.accent,
    height: 50,
    left: 0,
    position: 'absolute',
    width: '30%',
  },
  filledBarDanger: {
    backgroundColor: COLORS.danger,
  },
  text: {
    ...TYPOGRAPHY.secondary,
    fontWeight: 'bold',
  },
  textDanger: {
    color: COLORS.danger,
  },
  textLeft: {
    color: COLORS.textInverse,
    marginLeft: 15,
    marginRight: 'auto',
  },
  textRight: {
    color: COLORS.text,
    marginLeft: 'auto',
    marginRight: 15,
  },
});

interface Props {
  kegID: EntityID;
}

const LoadingKegLevelBar = () => (
  <View style={styles.container}>
    <LoadingIndicator />
  </View>
);

interface LoadedProps {
  value: Keg;
}

const LoadedKegLevelBar: React.FC<LoadedProps> = ({ value }) => {
  const animationValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    animationValue.setValue(0);
    Animated.timing(animationValue, {
      delay: 300,
      duration: 500,
      toValue: 1,
      useNativeDriver: false,
    }).start();
  }, [value, animationValue]);

  const kegLevel = calculateKegLevel(value);
  const isLowLevel = kegLevel <= LOW_KEG_LEVEL;
  const levelText = isLowLevel
    ? `Low keg level: ${kegLevel.toFixed(0)}%`
    : `${kegLevel.toFixed(0)}%`;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.filledBar,
          {
            width: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', `${kegLevel}%`],
            }),
          },
          isLowLevel && styles.filledBarDanger,
        ]}
      />
      <Text
        style={[
          styles.text,
          kegLevel > 50 ? styles.textLeft : styles.textRight,
          isLowLevel && styles.textDanger,
        ]}
      >
        {levelText}
      </Text>
    </View>
  );
};

export const KegLevelBar: React.FC<Props> = ({ kegID }) => {
  const keg = useGetKegById(kegID);

  if (keg.isLoading) {
    return <LoadingKegLevelBar />;
  }

  if (keg.data == null) {
    return null;
  }

  return <LoadedKegLevelBar value={keg.data} />;
};
