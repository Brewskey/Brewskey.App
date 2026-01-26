import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import Button from '../../../common/buttons/Button';
import Container from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import ErrorScreen from '../../../common/ErrorScreen';
import Header from '../../../common/Header';
import { useAddSnackBarMessage } from '../../../hooks/context/SnackBarContext';
import { useCreateFlowSensor } from '../../../hooks/queries/FlowSensorQueries';

import type { EntityID } from '@brewskey/js-api';

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

const NewFlowSensorScreen = withErrorBoundary(
  () => {
    const router = useRouter();
    const { tapId, shouldReturnOnFinish, onTapSetupFinish, showBackButton } =
      useLocalSearchParams<{
        tapId: string;
        shouldReturnOnFinish?: string;
        onTapSetupFinish?: string;
        showBackButton?: string;
      }>();
    const createFlowSensor = useCreateFlowSensor();
    const addSnackBarMessage = useAddSnackBarMessage();

    const tapIdValue =
      typeof tapId === 'string' && !isNaN(Number(tapId))
        ? Number(tapId)
        : tapId;
    const shouldReturn = shouldReturnOnFinish === 'true';

    const _onFlowSensorCreated = () => {
      addSnackBarMessage({ content: 'Flow sensor set' });

      if (shouldReturn && router.canGoBack()) {
        router.back();
      } else {
        router.navigate({
          pathname: '/(tabs)/taps/[tapId]/keg/new',
          params: {
            tapId: String(tapId),
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
          tapId,
          onFlowSensorCreated: JSON.stringify(_onFlowSensorCreated),
          ...(onTapSetupFinish ? { onTapSetupFinish } : {}),
        },
      });
    };

    return (
      <Container>
        <Header
          showBackButton={showBackButton !== 'false'}
          title="Setup flow sensor"
        />
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
