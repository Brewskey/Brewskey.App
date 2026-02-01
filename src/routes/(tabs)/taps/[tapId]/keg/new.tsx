import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from '../../../../../common/Container';
import { Header } from '../../../../../common/Header';
import { NotFoundScreen } from '../../../../../common/NotFoundScreen';
import { KegForm } from '../../../../../components/KegForm';
import { useAddSnackBarMessage } from '../../../../../hooks/context/SnackBarContext';
import { useCreateKeg } from '../../../../../hooks/queries/KegQueries';

import type { EntityID, KegMutator } from '@brewskey/js-api';

const NewKegScreen: React.FC = () => {
  const router = useRouter();
  const { tapId, returnTo } = useLocalSearchParams<{
    tapId: string;
    returnTo?: string;
  }>();
  const tapIdValue =
    typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

  const createKeg = useCreateKeg();
  const addSnackBarMessage = useAddSnackBarMessage();

  if (!tapIdValue) {
    return (
      <NotFoundScreen
        message="The tap you're looking for could not be found."
        title="Tap Not Found"
      />
    );
  }

  const onFormSubmit = async (values: KegMutator): Promise<KegMutator> => {
    await createKeg.mutateAsync(values);
    addSnackBarMessage({ content: 'New keg added' });

    if (returnTo === 'nux-finish') {
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
      router.navigate({
        pathname: '/(tabs)/taps/[tapId]/on_tap',
        params: { tapId: tapIdValue.toString() },
      });
    }

    return values;
  };

  const onFloatedSubmit = async (values: KegMutator): Promise<KegMutator> =>
    onFormSubmit(values);

  return (
    <Container>
      <Header shouldShowBackButton title="New keg" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <KegForm
          onFloatedSubmit={onFloatedSubmit}
          onSubmit={onFormSubmit}
          submitButtonLabel="Create keg"
          tapId={tapIdValue as EntityID}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default NewKegScreen;
