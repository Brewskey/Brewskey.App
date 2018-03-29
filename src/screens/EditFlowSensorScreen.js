// @flow

import type { EntityID, FlowSensor, FlowSensorMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { withNavigation } from 'react-navigation';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import InjectedComponent from '../common/InjectedComponent';
import { FlowSensorStore, waitForLoaded } from '../stores/DAOStores';
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
  static navigationOptions = {
    tabBarLabel: 'Flow Sensor',
  };

  @computed
  get _flowSensorLoader(): LoadObject<FlowSensor> {
    const { tapId } = this.injectedProps;
    return FlowSensorStore.getMany({
      filters: [DAOApi.createFilter('tap/id').equals(tapId)],
      limit: 1,
      orderBy: [{ column: 'id', direction: 'desc' }],
    }).map(
      (loaders: Array<LoadObject<FlowSensor>>): LoadObject<FlowSensor> =>
        loaders[0] || LoadObject.empty(),
    );
  }

  render() {
    const { tapId } = this.injectedProps;
    return (
      <LoaderComponent
        emptyComponent={EmptyComponent}
        loadedComponent={LoadedComponent}
        loader={this._flowSensorLoader}
        tapId={tapId}
        updatingComponent={LoadedComponent}
      />
    );
  }
}

type ExtraProps = {
  tapId: EntityID,
};

type LoadedComponentProps = {
  value: FlowSensor,
} & ExtraProps;

type InjectedLoadedComponentProps = {
  navigation: Navigation,
};

@withNavigation
@observer
class LoadedComponent extends InjectedComponent<
  InjectedLoadedComponentProps,
  LoadedComponentProps,
> {
  _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    const { value: initialFlowSensor } = this.props;

    if (initialFlowSensor.flowSensorType === values.flowSensorType) {
      const id = nullthrows(values.id);
      DAOApi.FlowSensorDAO.put(id, values);
      await waitForLoaded(() => FlowSensorStore.getByID(id));
    } else {
      const clientID = DAOApi.FlowSensorDAO.post(values);
      await waitForLoaded(() => FlowSensorStore.getByID(clientID));
    }
  };

  render() {
    const { value } = this.props;
    return (
      <FlowSensorForm
        flowSensor={value}
        onSubmit={this._onFormSubmit}
        tapId={value.tap.id}
      />
    );
  }
}

@withNavigation
@observer
class EmptyComponent extends InjectedComponent<
  ExtraProps,
  LoadedComponentProps,
> {
  _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    const clientID = DAOApi.FlowSensorDAO.post(values);
    await waitForLoaded(() => FlowSensorStore.getByID(clientID));
  };

  render() {
    const { tapId } = this.injectedProps;
    return <FlowSensorForm onSubmit={this._onFormSubmit} tapId={tapId} />;
  }
}

export default EditFlowSensorScreen;
