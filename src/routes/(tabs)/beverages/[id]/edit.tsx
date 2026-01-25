import type {
  BeverageMutator,
  EntityID,
} from '@brewskey/js-api';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { flushImageCache } from '../../../../common/CachedImage';
import ErrorScreen from '../../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../../common/ErrorBoundary';
import Container from '../../../../common/Container';
import Header from '../../../../common/Header';
import LoadingIndicator from '../../../../common/LoadingIndicator';
import NotFoundScreen from '../../../../common/NotFoundScreen';
import BeverageForm from '../../../../components/BeverageForm';
import { useAddSnackBarMessage } from '../../../../hooks/context/SnackBarContext';
import CONFIG from '../../../../config';
import { useGetBeverageById, useUpdateBeverage } from '../../../../hooks/queries/BeverageQueries';
import { useAccessToken } from '../../../../hooks/context/AuthContext';

const updateBeverageImage = async (beverageID: string, beverageData: string, accessToken: string | null): Promise<void> => {
  const response = await fetch(`${CONFIG.HOST}/api/v2/beverages/${beverageID}/photo/`, {
    body: JSON.stringify({ photo: beverageData }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to update beverage image: ${response.status} ${errorText.substring(0, 100)}`);
  }
};

const EditBeverageScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const beverageId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  const { data: beverage, isLoading } = useGetBeverageById(beverageId as EntityID);
  const updateMutation = useUpdateBeverage();
  const addSnackBarMessage = useAddSnackBarMessage();
  const accessToken = useAccessToken();

  if (!beverageId) {
    return (
      <NotFoundScreen
        title="Beverage Not Found"
        message="The beverage you're looking for could not be found."
      />
    );
  }

  const onFormSubmit = async (
    values: BeverageMutator & {
      beverageImage?: string;
    },
  ): Promise<void> => {
    const { beverageImage, ...beverageMutator } = values;
    const beverageIdValue = nullthrows(values.id);

    await updateMutation.mutateAsync(beverageMutator);
    
    if (beverageImage) {
      await updateBeverageImage(beverageIdValue.toString(), beverageImage, accessToken);
      flushImageCache(`${CONFIG.CDN}beverages/${beverageIdValue.toString()}`);
    }

    addSnackBarMessage({ content: 'The beverage edited.' });
    router.push({ pathname: '/(tabs)/beverages/[id]', params: { id: beverageIdValue.toString() } });
  };

  if (isLoading || !beverage) {
    return (
      <Container>
        <Header shouldShowBackButton title="Edit beverage" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <LoadingIndicator />
        </KeyboardAwareScrollView>
      </Container>
    );
  }

  return (
    <Container>
      <Header shouldShowBackButton title="Edit beverage" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <BeverageForm
          beverage={beverage}
          onSubmit={onFormSubmit}
          submitButtonLabel="Edit beverage"
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(EditBeverageScreen, <ErrorScreen shouldShowBackButton />);
