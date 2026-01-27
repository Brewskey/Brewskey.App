import * as React from 'react';

import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { flushImageCache } from '../../../common/CachedImage';
import { Container } from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import { ErrorScreen } from '../../../common/ErrorScreen';
import { Header } from '../../../common/Header';
import { BeverageForm } from '../../../components/BeverageForm';
import { CONFIG } from '../../../config';
import { useAccessToken } from '../../../hooks/context/AuthContext';
import { useAddSnackBarMessage } from '../../../hooks/context/SnackBarContext';
import { useCreateBeverage } from '../../../hooks/queries/BeverageQueries';

import type { BeverageMutator } from '@brewskey/js-api';

const updateBeverageImage = async (
  beverageID: string,
  beverageData: string,
  accessToken: string | null,
): Promise<void> => {
  const response = await fetch(
    `${CONFIG.HOST}/api/v2/beverages/${beverageID}/photo/`,
    {
      body: JSON.stringify({ photo: beverageData }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(
      `Failed to update beverage image: ${response.status} ${errorText.substring(0, 100)}`,
    );
  }
};

const NewBeverageScreen: React.FC = () => {
  const router = useRouter();
  const createMutation = useCreateBeverage();
  const addSnackBarMessage = useAddSnackBarMessage();
  const accessToken = useAccessToken();

  const onFormSubmit = async (
    values: BeverageMutator & {
      beverageImage?: string;
    },
  ): Promise<void> => {
    const { beverageImage, ...beverageMutator } = values;

    const beverage = await createMutation.mutateAsync(beverageMutator);
    const { id } = beverage;

    if (beverageImage) {
      await updateBeverageImage(String(id), beverageImage, accessToken);
      flushImageCache(`${CONFIG.CDN}beverages/${String(id)}`);
    }

    router.navigate({
      pathname: '/(tabs)/beverages/[id]',
      params: { id: String(id) },
    });
    addSnackBarMessage({ content: 'New beverage created.' });
  };

  return (
    <Container>
      <Header shouldShowBackButton title="New beverage" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <BeverageForm
          onSubmit={onFormSubmit}
          submitButtonLabel="Create beverage"
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(
  NewBeverageScreen,
  <ErrorScreen shouldShowBackButton />,
);
