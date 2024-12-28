import type { EntityID, Keg } from '@brewskey/js-api';

import * as React from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';

import LoadingIndicator from '../common/LoadingIndicator';
import { calculateKegLevel } from '../utils';
import { COLORS, TYPOGRAPHY, getElevationStyle } from '../theme';
import { useGetKegById } from '../hooks/queries/KegQueries';

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

type Props = {
  kegID: EntityID;
};

const LoadingKegLevelBar = () => (
  <View style={styles.container}>
    <LoadingIndicator />
  </View>
);

type LoadedProps = {
  value: Keg;
};

class LoadedKegLevelBar extends React.Component<LoadedProps> {
  _animationValue: Animated.Value;

  constructor(props: LoadedProps) {
    super(props);
    this._animationValue = new Animated.Value(0);
    this._animate();
  }

  componentWillMount() {}

  componentDidUpdate(prevProps: LoadedProps) {
    if (this.props.value !== prevProps.value) {
      this._animationValue.setValue(0);
      this._animate();
    }
  }

  _animate = () => {
    Animated.timing(this._animationValue, {
      delay: 300,
      duration: 500,
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  render(): React.ReactElement {
    const { value } = this.props;
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
              width: this._animationValue.interpolate({
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
  }
}

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
