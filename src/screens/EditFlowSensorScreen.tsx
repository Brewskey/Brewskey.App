import type { EntityID, FlowSensorMutator , FlowSensor } from '@brewskey/js-api';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FlowSensorDAO } from '@brewskey/js-api';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';

import FlowSensorForm from '../components/FlowSensorForm/FlowSensorForm';
import LoadingIndicator from '../common/LoadingIndicator';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  useCreateFlowSensor,
  useGetFlowSensorByTapId,
} from '../hooks/queries/FlowSensorQueries';

// Type that works with both StaticScreenProps and MaterialTopTabScreenProps
// We only use route.params.tapId, so this minimal type works for both navigation types
// Making route optional to satisfy ScreenComponentType which can accept ComponentType<{}>
type Props = {
  route?: {
    params: { tapId: EntityID };
  }
};

const EditFlowSensorScreen: React.FC<Props> = (props: Props) => {
  const tapId = props.route?.params?.tapId;
  if (!tapId) {
    return null;
  }
  const queryClient = useQueryClient();

  const { data: flowSensor, isLoading, error } = useGetFlowSensorByTapId(tapId);
  const createMutation = useCreateFlowSensor();
  const addSnackBarMessage = useAddSnackBarMessage();

  const updateMutation = useMutation<FlowSensor, Error, { id: EntityID; values: FlowSensorMutator }>({
    mutationFn: async ({ id, values }: { id: EntityID; values: FlowSensorMutator }) => {
      await FlowSensorDAO.put(id, values);
      return await FlowSensorDAO.fetchByID(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flow_sensor_by_tap_id', tapId] });
      addSnackBarMessage({ content: 'The flow sensor set' });
    },
  });

  if (isLoading) {
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <LoadingIndicator />
      </KeyboardAwareScrollView>
    );
  }

  if (error || !flowSensor) {
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <EmptyComponent tapId={tapId} createMutation={createMutation} />
      </KeyboardAwareScrollView>
    );
  }

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <LoadedComponent
        tapId={tapId}
        value={flowSensor}
        updateMutation={updateMutation}
        createMutation={createMutation}
      />
    </KeyboardAwareScrollView>
  );
};

type ExtraProps = {
  tapId: EntityID;
};

type LoadedComponentProps = {
  value: NonNullable<ReturnType<typeof useGetFlowSensorByTapId>['data']>;
  updateMutation: ReturnType<typeof useMutation<FlowSensor, Error, { id: EntityID; values: FlowSensorMutator }>>;
  createMutation: ReturnType<typeof useCreateFlowSensor>;
} & ExtraProps;

const LoadedComponent: React.FC<LoadedComponentProps> = ({
  tapId,
  value,
  updateMutation,
  createMutation,
}) => {
  const onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    if (value.flowSensorType === values.flowSensorType) {
      const id = nullthrows(values.id);
      await updateMutation.mutateAsync({ id, values });
    } else {
      // If type changed, create new one
      await createMutation.mutateAsync(values);
    }
  };

  return (
    <FlowSensorForm
      flowSensor={value}
      onSubmit={onFormSubmit}
      tapId={tapId}
    />
  );
};

type EmptyComponentProps = {
  createMutation: ReturnType<typeof useCreateFlowSensor>;
} & ExtraProps;

const EmptyComponent: React.FC<EmptyComponentProps> = ({
  tapId,
  createMutation,
}) => {
  const onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    await createMutation.mutateAsync(values);
  };

  return <FlowSensorForm onSubmit={onFormSubmit} tapId={tapId} />;
};

export default withErrorBoundary(EditFlowSensorScreen, <ErrorScreen showBackButton />);
