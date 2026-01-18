import type { EntityID, KegMutator } from '@brewskey/js-api';

import * as React from 'react';
import { useNavigation, StaticScreenProps, NavigationProp, CommonActions } from '@react-navigation/native';

import KegForm from '../components/KegForm';
import Container from '../common/Container';
import Header from '../common/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCreateKeg } from '../hooks/queries/KegQueries';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';

type Props = StaticScreenProps<{
  tapId: EntityID;
}>;

export const NewKegScreen: React.FC<Props> = ({
  route: {
    params: { tapId },
  },
}: Props) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const createKeg = useCreateKeg();
  const addSnackBarMessage = useAddSnackBarMessage();

  const onFormSubmit = async (values: KegMutator): Promise<KegMutator> => {
    await createKeg.mutateAsync(values);
    addSnackBarMessage({ content: 'New keg added' });
    
    // Navigate back or to tap details
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (tapId) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'LoggedInStack',
              params: {
                screen: 'menu',
                params: {
                  screen: 'taps',
                },
              },
            },
            {
              name: 'LoggedInStack',
              params: {
                screen: 'menu',
                params: {
                  screen: 'taps',
                  params: {
                    screen: 'tapDetails',
                    params: { tapId },
                  },
                },
              },
            },
          ],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'LoggedInStack',
              params: {
                screen: 'menu',
                params: {
                  screen: 'taps',
                },
              },
            },
          ],
        }),
      );
    }
    return values;
  };

  return (
    <Container>
      <Header showBackButton title="Add keg" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <KegForm
          onSubmit={onFormSubmit}
          submitButtonLabel="Add keg"
          tapId={tapId}
          onFloatedSubmit={async (values) => values}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default NewKegScreen;
