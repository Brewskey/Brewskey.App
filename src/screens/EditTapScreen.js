// @flow

import type {
  EntityID,
  Keg,
  KegMutator,
  Tap,
  TapMutator,
} from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import { KegStore, TapStore, waitForLoaded } from '../stores/DAOStores';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Container from '../common/Container';
import Button from '../common/buttons/Button';
import LoaderComponent from '../common/LoaderComponent';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import KegForm from '../components/KegForm';
import TapForm from '../components/TapForm';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class EditTapScreen extends InjectedComponent<InjectedProps> {
  _onKegFormSubmit = async (values: KegMutator): Promise<void> => {
    const id = nullthrows(values.id);
    DAOApi.KegDAO.put(id, values);
    await waitForLoaded(() => KegStore.getByID(id));
    // todo add success snackbar message
  };

  _onTapFormSubmit = async (values: TapMutator): Promise<void> => {
    DAOApi.TapDAO.put(nullthrows(values.id), values);
    // todo may be don't need to navigate back on tapUpdate
    // do it just like for keg form
    this.injectedProps.navigation.goBack(null);
  };

  _onUpdateFlowSensorButtonPress = () => {
    const { id, navigation } = this.injectedProps;
    navigation.navigate('editFlowSensor', { tapId: id });
  };

  render() {
    const { id } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Edit tap" />
        <KeyboardAwareScrollView>
          <LoaderComponent
            loadedComponent={LoadedTapComponent}
            loader={TapStore.getByID(id)}
            onTapFormSubmit={this._onTapFormSubmit}
            updatingComponent={LoadedTapComponent}
          />
          <LoaderComponent
            emptyComponent={NoKegComponent}
            loadedComponent={LoadedKegComponent}
            loader={KegStore.getMany({
              filters: [DAOApi.createFilter('tap/id').equals(id)],
              limit: 1,
            }).map(
              (loaders: Array<LoadObject<Keg>>): LoadObject<Keg> =>
                loaders[0] || LoadObject.empty(),
            )}
            onKegFormSubmit={this._onKegFormSubmit}
            tapId={id}
            updatingComponent={LoadedKegComponent}
          />
          <Button
            onPress={this._onUpdateFlowSensorButtonPress}
            title="Update flow sensor"
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

type LoadedTapComponentProps = {
  onTapFormSubmit: (values: TapMutator) => Promise<void>,
  value: Tap,
};

const LoadedTapComponent = ({
  onTapFormSubmit,
  value,
}: LoadedTapComponentProps) => (
  <TapForm
    onSubmit={onTapFormSubmit}
    submitButtonLabel="Edit tap"
    tap={value}
  />
);

type LoadedKegComponentProps = {
  onKegFormSubmit: (values: KegMutator) => Promise<void>,
  tapId: EntityID,
  value: Keg,
};

const LoadedKegComponent = ({
  value,
  tapId,
  onKegFormSubmit,
}: LoadedKegComponentProps) => (
  <KegForm
    keg={value}
    onSubmit={onKegFormSubmit}
    submitButtonLabel="Update current keg"
    tapId={tapId}
  />
);

type NoKegComponentProps = {
  tapId: EntityID,
};

type NoKegComponentInjectedProps = {
  navigation: Navigation,
};

@withNavigation
class NoKegComponent extends InjectedComponent<
  NoKegComponentInjectedProps,
  NoKegComponentProps,
> {
  componentWillMount() {
    const { tapId } = this.props;
    this.injectedProps.navigation.navigate('newKeg', { tapId });
  }

  render() {
    return null;
  }
}

export default EditTapScreen;
