import type { EntityID, KegMutator } from '@brewskey/js-api';

import * as React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

import KegForm from '../../../../../components/KegForm';
import Container from '../../../../../common/Container';
import Header from '../../../../../common/Header';
import NotFoundScreen from '../../../../../common/NotFoundScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCreateKeg } from '../../../../../hooks/queries/KegQueries';
import { useAddSnackBarMessage } from '../../../../../hooks/context/SnackBarContext';

const NewKegScreen: React.FC = () => {
  const router = useRouter();
  const { tapId, onTapSetupFinish } = useLocalSearchParams<{ 
    tapId: string;
    onTapSetupFinish?: string;
  }>();
  const tapIdValue = typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

  const createKeg = useCreateKeg();
  const addSnackBarMessage = useAddSnackBarMessage();

  if (!tapIdValue) {
    return (
      <NotFoundScreen
        title="Tap Not Found"
        message="The tap you're looking for could not be found."
      />
    );
  }

  const onFormSubmit = async (values: KegMutator): Promise<KegMutator> => {
    await createKeg.mutateAsync(values);
    addSnackBarMessage({ content: 'New keg added' });
    
    // If onTapSetupFinish is provided (from NUX flow), navigate to nuxFinish instead of normal navigation
    // In NUX flow, onTapSetupFinish indicates we should navigate to the finish screen
    if (onTapSetupFinish) {
      // Navigate to nuxFinish screen - this completes the NUX flow
      // The finish screen will handle the final navigation to tap details
      router.replace({
        pathname: '/(tabs)/(nux)/finish',
        params: {
          tapId: tapIdValue.toString(),
        },
      });
      return values;
    }
    
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate({ pathname: '/(tabs)/taps/[tapId]/on_tap', params: { tapId: tapIdValue.toString() } });
    }
    
    return values;
  };

  const onFloatedSubmit = async (values: KegMutator): Promise<KegMutator> => {
    return onFormSubmit(values);
  };

  return (
    <Container>
      <Header shouldShowBackButton title="New keg" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <KegForm
          onSubmit={onFormSubmit}
          onFloatedSubmit={onFloatedSubmit}
          submitButtonLabel="Create keg"
          tapId={tapIdValue as EntityID}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default NewKegScreen;
