import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Button from '../../../common/buttons/Button';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCreateFlowSensor } from '../../../hooks/queries/FlowSensorQueries';
import { useAddSnackBarMessage } from '../../../hooks/context/SnackBarContext';

const DEFAULT_FLOW_SENSOR = {
  flowSensorType: 'Titan',
  pulsesPerGallon: 5375,
} as const;

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 30,
  },
  container: {
    paddingVertical: 30,
  },
});

const NewFlowSensorScreen = withErrorBoundary(() => {
    const router = useRouter();
    const { tapId, shouldReturnOnFinish, onTapSetupFinish, showBackButton } = useLocalSearchParams<{ 
      tapId: string;
      shouldReturnOnFinish?: string;
      onTapSetupFinish?: string;
      showBackButton?: string;
    }>();
    const createFlowSensor = useCreateFlowSensor();
    const addSnackBarMessage = useAddSnackBarMessage();

    const tapIdValue = typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;
    const shouldReturn = shouldReturnOnFinish === 'true';

    const _onFlowSensorCreated = () => {
      addSnackBarMessage({ content: 'Flow sensor set' });

      if (shouldReturn && router.canGoBack()) {
        router.back();
      } else {
        router.navigate({
          pathname: `/(tabs)/taps/${tapId}/keg/new`,
          params: {
            ...(onTapSetupFinish ? { onTapSetupFinish } : {}),
          },
        });
      }
    };

    const _onDefaultButtonPress = async () => {
      await createFlowSensor.mutateAsync({
        ...DEFAULT_FLOW_SENSOR,
        tapId: tapIdValue as EntityID,
      });
      _onFlowSensorCreated();
    };

    const _onCustomButtonPress = () => {
      router.navigate({
        pathname: '/(tabs)/flow-sensor/custom',
        params: {
          tapId: tapId as string,
          onFlowSensorCreated: JSON.stringify(_onFlowSensorCreated),
          ...(onTapSetupFinish ? { onTapSetupFinish } : {}),
        },
      });
    };

    return (
      <Container>
        <Header title="Setup flow sensor" showBackButton={showBackButton !== 'false'} />
        <View style={styles.container}>
          <Button
            containerStyle={styles.buttonContainer}
            onPress={_onDefaultButtonPress}
            testID="button-i-got-my-sensor-from-brewskey"
            title="I got my sensor from Brewskey"
          />
          <Button
            onPress={_onCustomButtonPress}
            testID="button-i-would-like-to-setup-a-different-sensor"
            title="I'd like to setup a different sensor"
          />
        </View>
      </Container>
    );
  },
  <ErrorScreen shouldShowBackButton />,
);

export default NewFlowSensorScreen;
