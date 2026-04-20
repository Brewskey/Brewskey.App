import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { Button } from 'common/buttons/Button';
import { SETUP_STEPS } from 'components/HardwareSetupGuide/setupSteps';
import { COLORS } from 'theme';

import type { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
  container: {
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
  const pagerRef = React.useRef<PagerView>(null);
  const [stepIndex, setStepIndex] = React.useState(0);

  const isLastStep = stepIndex === SETUP_STEPS.length - 1;

  const handleNextButtonPress = React.useCallback(() => {
    if (!isLastStep) {
      pagerRef.current?.setPage(stepIndex + 1);
    } else {
      onClosePress();
    }
  }, [isLastStep, onClosePress, stepIndex]);

  const handlePageSelected = React.useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      setStepIndex(event.nativeEvent.position);
    },
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        initialPage={0}
        onPageSelected={handlePageSelected}
        style={styles.pager}
      >
        {SETUP_STEPS.map(
          (setupStep: React.ReactNode, index: number): React.ReactElement => (
            <View key={index} style={styles.container}>
              {setupStep}
            </View>
          ),
        )}
      </PagerView>
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
