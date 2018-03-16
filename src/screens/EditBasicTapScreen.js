// @flow

import type { EntityID, LoadObject, Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { TapStore, waitForLoaded } from '../stores/DAOStores';
import LoaderComponent from '../common/LoaderComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapForm from '../components/TapForm';

type InjectedProps = {|
  tapId: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class EditTapScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'tap',
  };

  @computed
  get _tapLoader(): LoadObject<Tap> {
    return TapStore.getByID(this.injectedProps.tapId);
  }

  _onFormSubmit = async (values: TapMutator): Promise<void> => {
    const id = nullthrows(values.id);
    DAOApi.TapDAO.put(id, values);
    await waitForLoaded(() => TapStore.getByID(id));
    // todo add message to snackbar
  };

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedTapComponent}
        loader={this._tapLoader}
        onTapFormSubmit={this._onFormSubmit}
        updatingComponent={LoadedTapComponent}
      />
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

export default EditTapScreen;
