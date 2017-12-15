// @flow

import type {
  EntityID,
  FlowSensor,
  FlowSensorMutator,
  LoadObject,
} from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import InjectedComponent from '../common/InjectedComponent';
import { FlowSensorStore, waitForLoaded } from '../stores/DAOStores';
import Container from '../common/Container';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import FlowSensorForm from '../components/FlowSensorForm';
import LoaderComponent from '../common/LoaderComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  navigation: Navigation,
  tapId: EntityID,
|};

@flatNavigationParamsAndScreenProps
@observer
class EditFlowSensorScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    const { navigation } = this.injectedProps;
    const id = nullthrows(values.id);
    DAOApi.FlowSensorDAO.put(id, values);
    await waitForLoaded(() => FlowSensorStore.getByID(id));
    navigation.goBack();
  };
  render() {
    const { tapId } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Update tap sensor" />
        <LoaderComponent
          loader={FlowSensorStore.getMany({
            filters: [DAOApi.createFilter('tap/id').equals(tapId)],
          })}
          loadedComponent={LoadedComponent}
          onFormSubmit={this._onFormSubmit}
        />
      </Container>
    );
  }
}

type LoadedComponentProps = {
  onFormSubmit: (values: FlowSensorMutator) => Promise<void>,
  value: Array<LoadObject<FlowSensor>>,
};

const LoadedComponent = ({ onFormSubmit, value }: LoadedComponentProps) => {
  const flowSensorLoader = value[0];
  // todo make it with another loaderComponent
  if (!flowSensorLoader || flowSensorLoader.isLoading()) {
    return <LoadingIndicator />;
  }

  const flowSensor = flowSensorLoader.getValueEnforcing();
  return (
    <FlowSensorForm
      flowSensor={flowSensor}
      onSubmit={onFormSubmit}
      tapId={flowSensor.tap.id}
    />
  );
};

export default EditFlowSensorScreen;
