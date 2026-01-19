import type { EntityID, FlowSensorMutator } from '@brewskey/js-api';

import * as React from 'react';
import { StaticScreenProps, useRoute } from '@react-navigation/native';

import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary, withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import FlowSensorForm from '../components/FlowSensorForm/FlowSensorForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCreateFlowSensor } from '../hooks/queries/FlowSensorQueries';

type Props = StaticScreenProps<{
  tapId: EntityID;
  onFlowSensorCreated?: () => void | Promise<void>;
}>;

export const NewFlowSensorCustomScreen: React.FC<Props> =
  withErrorBoundary(
    ({
      route: {
        params: { tapId, onFlowSensorCreated },
      },
    }: Props) => {
      const createFlowSensor = useCreateFlowSensor();

      const _onFormSubmit = async (
        values: FlowSensorMutator,
      ): Promise<void> => {
        await createFlowSensor.mutateAsync(values);
        if (onFlowSensorCreated) {
          onFlowSensorCreated();
        }
      };

      if (!tapId) {
        return null;
      }

      return (
        <Container>
          <Header shouldShowBackButton title="Set tap sensor" />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <FlowSensorForm tapId={tapId} onSubmit={_onFormSubmit} />
          </KeyboardAwareScrollView>
        </Container>
      );
    },
    <ErrorScreen shouldShowBackButton />,
  );
