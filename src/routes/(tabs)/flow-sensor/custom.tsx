import type { EntityID, FlowSensorMutator } from '@brewskey/js-api';

import * as React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import FlowSensorForm from '../../../components/FlowSensorForm/FlowSensorForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCreateFlowSensor } from '../../../hooks/queries/FlowSensorQueries';

const NewFlowSensorCustomScreen = withErrorBoundary(() => {
      const router = useRouter();
      const { tapId, onFlowSensorCreated, onTapSetupFinish } = useLocalSearchParams<{ 
        tapId: string;
        onFlowSensorCreated?: string;
        onTapSetupFinish?: string;
      }>();
      const createFlowSensor = useCreateFlowSensor();

      const tapIdValue = typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

      const _onFormSubmit = async (
        values: FlowSensorMutator,
      ): Promise<void> => {
        await createFlowSensor.mutateAsync(values);
        if (onFlowSensorCreated) {
          try {
            const callback = JSON.parse(onFlowSensorCreated);
            callback();
          } catch (parseError) {
            console.error('Failed to parse onFlowSensorCreated callback:', parseError);
            // Continue execution even if callback parsing fails
            // Fall through to default navigation
            router.navigate({
              pathname: '/(tabs)/taps/[tapId]/keg/new',
              params: {
                tapId: String(tapId),
                ...(onTapSetupFinish ? { onTapSetupFinish } : {}),
              },
            });
          }
        } else {
          // If no callback, navigate to keg creation (same as default flow sensor)
          router.navigate({
            pathname: '/(tabs)/taps/[tapId]/keg/new',
            params: {
              tapId: String(tapId),
              ...(onTapSetupFinish ? { onTapSetupFinish } : {}),
            },
          });
        }
      };

      if (!tapIdValue) {
        return null;
      }

      return (
        <Container>
          <Header shouldShowBackButton title="Set tap sensor" />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <FlowSensorForm tapId={tapIdValue as EntityID} onSubmit={_onFormSubmit} />
          </KeyboardAwareScrollView>
        </Container>
      );
    },
    <ErrorScreen shouldShowBackButton />,
  );

export default NewFlowSensorCustomScreen;
