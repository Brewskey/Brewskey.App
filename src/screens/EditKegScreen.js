// @flow

import type { EntityID, Keg, KegMutator } from 'brewskey.js-api';

import * as React from 'react';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import nullthrows from 'nullthrows';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import InjectedComponent from '../common/InjectedComponent';
import { KegStore, TapStore, waitForLoaded } from '../stores/DAOStores';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import LoaderComponent from '../common/LoaderComponent';
import KegForm from '../components/KegForm';
import SnackBarStore from '../stores/SnackBarStore';

type InjectedProps = {
  tapId: EntityID,
};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class EditKegScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'On tap',
  };

  @computed
  get _kegLoader(): LoadObject<Keg> {
    const { tapId } = this.injectedProps;
    return KegStore.getSingle({
      filters: [DAOApi.createFilter('tap/id').equals(tapId)],
    });
  }

  _onReplaceSubmit = async (values: KegMutator): Promise<void> => {
    const clientID = DAOApi.KegDAO.post(values);
    await waitForLoaded(() => KegStore.getByID(clientID));
    TapStore.flushCache();
    SnackBarStore.showMessage({ text: 'Keg replaced' });
  };

  _onEditSubmit = async (values: KegMutator): Promise<void> => {
    const id = nullthrows(values.id);
    DAOApi.KegDAO.put(id, values);
    await waitForLoaded(() => KegStore.getByID(id));
    TapStore.flushCache();
    SnackBarStore.showMessage({ text: 'Current keg updated' });
  };

  _onFloatKegSubmit = async (values: KegMutator): Promise<void> => {
    const id = nullthrows(values.id);
    DAOApi.KegDAO.floatKeg(id);
    await waitForLoaded(() => KegStore.getByID(id));
    TapStore.flushCache();
    SnackBarStore.showMessage({ text: 'Current keg floated' });
  };

  render() {
    return (
      <LoaderComponent
        emptyComponent={EmptyComponent}
        loadedComponent={LoadedComponent}
        loader={this._kegLoader}
        onEditSubmit={this._onEditSubmit}
        onFloatedSubmit={this._onFloatKegSubmit}
        onReplaceSubmit={this._onReplaceSubmit}
        tapId={this.injectedProps.tapId}
        updatingComponent={LoadedComponent}
      />
    );
  }
}

type ExtraProps = {
  onEditSubmit: (values: KegMutator) => Promise<void>,
  onFloatedSubmit: (values: KegMutator) => Promise<void>,
  onReplaceSubmit: (values: KegMutator) => Promise<void>,
  tapId: EntityID,
};

type LoadedComponentProps = {
  value: Keg,
} & ExtraProps;

const LoadedComponent = ({
  onEditSubmit,
  onFloatedSubmit,
  onReplaceSubmit,
  tapId,
  value,
}: LoadedComponentProps) => (
  <KegForm
    keg={value}
    onFloatedSubmit={onFloatedSubmit}
    onReplaceSubmit={onReplaceSubmit}
    onSubmit={onEditSubmit}
    showReplaceButton
    submitButtonLabel="Update current keg"
    tapId={tapId}
  />
);

const EmptyComponent = ({ onReplaceSubmit, tapId }: ExtraProps) => (
  <KegForm
    onSubmit={onReplaceSubmit}
    submitButtonLabel="Create keg"
    tapId={tapId}
  />
);

export default EditKegScreen;
