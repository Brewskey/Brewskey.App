import * as React from 'react';

import nullthrows from 'nullthrows';
import { StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';

import SETUP_STEPS from './setupSteps';
import Button from '../../common/buttons/Button';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  activeDotStyle: {
    backgroundColor: COLORS.secondary,
    height: 10,
    width: 10,
  },
  closeButtonContainer: {
    bottom: 15,
    left: 10,
    position: 'absolute',
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.primary3,
    flex: 1,
  },
  dotStyle: {
    height: 10,
    width: 10,
  },
  nextButtonContainer: {
    bottom: 15,
    position: 'absolute',
    right: 10,
  },
  paginationStyle: {
    bottom: 30,
  },
});

interface Props {
  onClosePress: () => void;
}

const HardwareSetupGuide: React.FC<Props> = ({ onClosePress }) => {
  const swiperRef = React.useRef<Swiper>(null);
  const [stepIndex, setStepIndex] = React.useState(0);

  const isLastStep = stepIndex === SETUP_STEPS.length - 1;

  const handleNextButtonPress = React.useCallback(() => {
    if (!isLastStep) {
      nullthrows(swiperRef.current).scrollBy(1 + stepIndex);
    } else {
      onClosePress();
    }
  }, [isLastStep, onClosePress]);

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        ref={swiperRef}
        activeDotStyle={styles.activeDotStyle}
        dotStyle={styles.dotStyle}
        loop={false}
        onIndexChanged={setStepIndex}
        paginationStyle={styles.paginationStyle}
      >
        {SETUP_STEPS.map(
          (setupStep: React.ReactNode, index: number): React.ReactElement => (
            <View key={index} style={styles.container}>
              {setupStep}
            </View>
          ),
        )}
      </Swiper>
      {!isLastStep && (
        <Button
          containerStyle={styles.closeButtonContainer}
          onPress={onClosePress}
          title="CLOSE"
          type="clear"
        />
      )}
      <Button
        containerStyle={styles.nextButtonContainer}
        onPress={handleNextButtonPress}
        testID="hardware-setup-guide-next-button"
        title={isLastStep ? 'FINISH' : 'NEXT'}
        type="clear"
      />
    </View>
  );
};

export default HardwareSetupGuide;
