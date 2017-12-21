// @flow

import type { EntityID, Keg, KegMutator } from 'brewskey.js-api';

import * as React from 'react';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import nullthrows from 'nullthrows';
import { observer } from 'mobx-react';
import InjectedComponent from '../common/InjectedComponent';
import { KegStore, waitForLoaded } from '../stores/DAOStores';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import LoaderComponent from '../common/LoaderComponent';
import KegForm from '../components/KegForm';

type InjectedProps = {
  tapId: EntityID,
};

@flatNavigationParamsAndScreenProps
@observer
class EditKegScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Keg',
  };

  _onFormSubmit = async (values: KegMutator): Promise<void> => {
    const id = nullthrows(values.id);
    DAOApi.KegDAO.put(id, values);
    await waitForLoaded(() => KegStore.getByID(id));
    // todo add success snackbar message
  };

  render() {
    const { tapId } = this.injectedProps;
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={KegStore.getMany({
          filters: [DAOApi.createFilter('tap/id').equals(tapId)],
          limit: 1,
        }).map(
          (loaders: Array<LoadObject<Keg>>): LoadObject<Keg> =>
            loaders[0] || LoadObject.empty(),
        )}
        onFormSubmit={this._onFormSubmit}
        tapId={tapId}
        updatingComponent={LoadedComponent}
      />
    );
  }
}

type LoadedComponentProps = {
  onFormSubmit: (values: KegMutator) => Promise<void>,
  tapId: EntityID,
  value: Keg,
};

const LoadedComponent = ({
  value,
  tapId,
  onFormSubmit,
}: LoadedComponentProps) => (
  <KegForm
    keg={value}
    onSubmit={onFormSubmit}
    submitButtonLabel="Update current keg"
    tapId={tapId}
  />
);
export default EditKegScreen;
