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
      const { tapId, onFlowSensorCreated } = useLocalSearchParams<{ 
        tapId: string;
        onFlowSensorCreated?: string;
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
          }
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
