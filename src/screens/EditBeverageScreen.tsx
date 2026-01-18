import type {
  BeverageMutator,
  EntityID,
} from '@brewskey/js-api';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { useNavigation, StaticScreenProps, NavigationProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { flushImageCache } from '../common/CachedImage';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import LoadingIndicator from '../common/LoadingIndicator';
import BeverageForm from '../components/BeverageForm';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import CONFIG from '../config';
import { useGetBeverageById, useUpdateBeverage } from '../hooks/queries/BeverageQueries';
import { useAccessToken } from '../stores/AuthStore';

const updateBeverageImage = async (beverageID: string, beverageData: string, accessToken: string | null): Promise<void> => {
  await fetch(`${CONFIG.HOST}/api/v2/beverages/${beverageID}/photo/`, {
    body: JSON.stringify({ photo: beverageData }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
};

type Props = StaticScreenProps<{
  id: EntityID;
}>;

const EditBeverageScreen: React.FC<Props> = ({
  route: {
    params: { id },
  },
}: Props) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const { data: beverage, isLoading } = useGetBeverageById(id);
  const updateMutation = useUpdateBeverage();
  const addSnackBarMessage = useAddSnackBarMessage();
  const accessToken = useAccessToken();

  const onFormSubmit = async (
    values: BeverageMutator & {
      beverageImage?: string;
    },
  ): Promise<void> => {
    const { beverageImage, ...beverageMutator } = values;
    const beverageId = nullthrows(values.id);

    try {
      await updateMutation.mutateAsync(beverageMutator);
      
      if (beverageImage) {
        await updateBeverageImage(beverageId.toString(), beverageImage, accessToken);
        flushImageCache(`${CONFIG.CDN}beverages/${beverageId.toString()}`);
      }

      navigation.goBack();
      addSnackBarMessage({ content: 'The beverage edited.' });
    } catch (error) {
      // Error handling is done by the mutation
      throw error;
    }
  };

  if (isLoading || !beverage) {
    return (
      <Container>
        <Header showBackButton title="Edit beverage" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <LoadingIndicator />
        </KeyboardAwareScrollView>
      </Container>
    );
  }

  return (
    <Container>
      <Header showBackButton title="Edit beverage" />
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

export default withErrorBoundary(EditBeverageScreen, <ErrorScreen showBackButton />);
