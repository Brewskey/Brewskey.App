import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { SwipePager } from 'common/SwipePager';
import { SETUP_STEPS } from 'components/HardwareSetupGuide/setupSteps';
import { COLORS } from 'theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  stepContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.primary3,
    flex: 1,
  },
  closeButtonContainer: {
    bottom: 15,
    left: 10,
    position: 'absolute',
  },
  nextButtonContainer: {
    bottom: 15,
    position: 'absolute',
    right: 10,
  },
  pagination: {
    alignItems: 'center',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  dot: {
    backgroundColor: COLORS.secondary3,
    borderRadius: 5,
    height: 10,
    marginHorizontal: 4,
    width: 10,
  },
  activeDot: {
    backgroundColor: COLORS.secondary,
  },
});

interface Props {
  onClosePress: () => void;
}

const HardwareSetupGuide: React.FC<Props> = ({ onClosePress }) => {
  const [stepIndex, setStepIndex] = React.useState(0);

  const isLastStep = stepIndex === SETUP_STEPS.length - 1;

  const handleNextButtonPress = React.useCallback(() => {
    if (!isLastStep) {
      setStepIndex((index) => index + 1);
    } else {
      onClosePress();
    }
  }, [isLastStep, onClosePress]);

  return (
    <View style={styles.root}>
      <SwipePager
        currentIndex={stepIndex}
        onIndexChanged={setStepIndex}
        style={styles.pager}
      >
        {SETUP_STEPS.map((setupStep, index) => (
          <View key={index} style={styles.stepContainer}>
            {setupStep}
          </View>
        ))}
      </SwipePager>
      <View pointerEvents="none" style={styles.pagination}>
        {SETUP_STEPS.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === stepIndex && styles.activeDot]}
          />
        ))}
      </View>
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
        testID={`hardware-setup-guide-${isLastStep ? 'finish' : 'next'}-button`}
        title={isLastStep ? 'FINISH' : 'NEXT'}
        type="clear"
      />
    </View>
  );
};

export { HardwareSetupGuide };
