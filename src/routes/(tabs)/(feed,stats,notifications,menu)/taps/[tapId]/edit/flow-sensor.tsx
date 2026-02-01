import * as React from 'react';

import { FlowSensorDAO } from '@brewskey/js-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import nullthrows from 'nullthrows';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { FlowSensorForm } from 'components/FlowSensorForm/FlowSensorForm';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import {
  useCreateFlowSensor,
  useGetFlowSensorByTapId,
} from 'hooks/queries/FlowSensorQueries';
import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { EntityID, FlowSensor, FlowSensorMutator } from '@brewskey/js-api';

interface ExtraProps {
  tapId: EntityID;
}

type LoadedComponentProps = {
  value: NonNullable<ReturnType<typeof useGetFlowSensorByTapId>['data']>;
  updateMutation: ReturnType<
    typeof useMutation<
      FlowSensor,
      Error,
      { id: EntityID; values: FlowSensorMutator }
    >
  >;
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
    <FlowSensorForm flowSensor={value} onSubmit={onFormSubmit} tapId={tapId} />
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

const EditTapFlowSensorRoute: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const tapIdValue =
    typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

  // All hooks must be called unconditionally before any early returns
  const queryClient = useQueryClient();

  const {
    data: flowSensor,
    isLoading,
    error,
  } = useGetFlowSensorByTapId(tapIdValue as EntityID);
  const createMutation = useCreateFlowSensor();
  const addSnackBarMessage = useAddSnackBarMessage();

  const updateMutation = useMutation<
    FlowSensor,
    Error,
    { id: EntityID; values: FlowSensorMutator }
  >({
    mutationFn: async ({
      id,
      values,
    }: {
      id: EntityID;
      values: FlowSensorMutator;
    }) => {
      await FlowSensorDAO.put(id, values);
      return FlowSensorDAO.fetchByID(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flow_sensor_by_tap_id', getStringFromEntityID(tapIdValue)],
      });
      addSnackBarMessage({ content: 'The flow sensor set' });
    },
  });

  if (!tapIdValue) {
    return (
      <NotFoundScreen
        message="The tap you're looking for could not be found."
        title="Tap Not Found"
      />
    );
  }

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
        <EmptyComponent
          createMutation={createMutation}
          tapId={tapIdValue as EntityID}
        />
      </KeyboardAwareScrollView>
    );
  }

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <LoadedComponent
        createMutation={createMutation}
        tapId={tapIdValue as EntityID}
        updateMutation={updateMutation}
        value={flowSensor}
      />
    </KeyboardAwareScrollView>
  );
};

export default withErrorBoundary(
  EditTapFlowSensorRoute,
  <ErrorScreen shouldShowBackButton />,
);
