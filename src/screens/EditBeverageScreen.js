// @flow

import type {
  Beverage,
  BeverageMutator,
  EntityID,
  LoadObject,
} from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BeverageStore, waitForLoaded } from '../stores/DAOStores';
import { UpdateBeverageImageStore } from '../stores/ApiRequestStores/CommonApiStores';
import { flushImageCache } from '../common/CachedImage';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import LoaderComponent from '../common/LoaderComponent';
import Container from '../common/Container';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import BeverageForm from '../components/BeverageForm';
import SnackBarStore from '../stores/SnackBarStore';
import CONFIG from '../config';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class EditBeverageScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _beverageLoader(): LoadObject<Beverage> {
    return BeverageStore.getByID(this.injectedProps.id);
  }

  _onFormSubmit = async (
    values: BeverageMutator & { beverageImage?: string },
  ): Promise<void> => {
    const { beverageImage, ...beverageMutator } = values;
    const id = nullthrows(values.id);

    const clientID = DAOApi.BeverageDAO.put(id, beverageMutator);
    await DAOApi.BeverageDAO.waitForLoaded((dao) => dao.fetchByID(clientID));
    if (beverageImage) {
      await waitForLoaded(() =>
        UpdateBeverageImageStore.get(id, beverageImage),
      );
      UpdateBeverageImageStore.flushCache();
      flushImageCache(`${CONFIG.CDN}beverages/${id.toString()}`);
    }

    this.injectedProps.navigation.goBack(null);
    SnackBarStore.showMessage({ text: 'The beverage edited.' });
  };

  render(): React.Node {
    return (
      <Container>
        <Header showBackButton title="Edit beverage" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <LoaderComponent
            loadedComponent={LoadedComponent}
            loader={this._beverageLoader}
            onFormSubmit={this._onFormSubmit}
            updatingComponent={LoadedComponent}
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

type LoadedComponentProps = {|
  onFormSubmit: (values: BeverageMutator) => void,
  value: Beverage,
|};

const LoadedComponent = ({ onFormSubmit, value }: LoadedComponentProps) => (
  <BeverageForm
    beverage={value}
    onSubmit={onFormSubmit}
    submitButtonLabel="Edit beverage"
  />
);

export default EditBeverageScreen;
