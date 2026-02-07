import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { FlowSensorForm } from 'components/FlowSensorForm/FlowSensorForm';
import { useCreateFlowSensor } from 'hooks/queries/FlowSensorQueries';

import type { EntityID, FlowSensorMutator } from '@brewskey/js-api';

const NewFlowSensorCustomScreen = () => {
  const router = useRouter();
  const { tapId, returnTo } = useLocalSearchParams<{
    tapId: string;
    returnTo?: string;
  }>();
  const createFlowSensor = useCreateFlowSensor();

  const tapIdValue =
    typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

  const _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    await createFlowSensor.mutateAsync(values);
    router.navigate({
      pathname: '/taps/[tapId]/keg/new',
      params: {
        tapId: String(tapId),
        ...(returnTo ? { returnTo } : {}),
      },
    });
  };

  if (!tapIdValue) {
    return null;
  }

  return (
    <Container>
      <Header shouldShowBackButton title="Set tap sensor" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <FlowSensorForm
          onSubmit={_onFormSubmit}
          tapId={tapIdValue as EntityID}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default NewFlowSensorCustomScreen;
