import type { BeverageMutator } from '@brewskey/js-api';

import * as React from 'react';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { flushImageCache } from '../common/CachedImage';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import BeverageForm from '../components/BeverageForm';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import CONFIG from '../config';
import { useCreateBeverage } from '../hooks/queries/BeverageQueries';
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

const NewBeverageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
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
    const id = beverage.id;

    if (beverageImage) {
      await updateBeverageImage(String(id), beverageImage, accessToken);
      flushImageCache(`${CONFIG.CDN}beverages/${String(id)}`);
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: 'LoggedInStack',
            params: {
              screen: 'menu',
              params: {
                screen: 'myBeverages',
              },
            },
          },
          {
            name: 'LoggedInStack',
            params: {
              screen: 'menu',
              params: {
                screen: 'myBeverages',
                params: {
                  screen: 'beverageDetails',
                  params: { id },
                },
              },
            },
          },
        ],
      }),
    );
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

export default withErrorBoundary(NewBeverageScreen, <ErrorScreen shouldShowBackButton />);
