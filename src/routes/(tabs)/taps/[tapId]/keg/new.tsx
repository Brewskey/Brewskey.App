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
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
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
    
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate(`/(tabs)/taps/${tapIdValue}`);
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
