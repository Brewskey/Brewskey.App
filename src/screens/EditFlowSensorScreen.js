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
import { withNavigation } from 'react-navigation';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import InjectedComponent from '../common/InjectedComponent';
import { FlowSensorStore, waitForLoaded } from '../stores/DAOStores';
import Container from '../common/Container';
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
          waitForLoadedDeep
        />
      </Container>
    );
  }
}

type LoadedComponentProps = {
  value: Array<LoadObject<FlowSensorForm>>,
  onFormSubmit: (values: FlowSensorMutator) => Promise<void>,
};

type InjectedLoadedComponentProps = {
  navigation: Navigation,
};

@withNavigation
@observer
class LoadedComponent extends InjectedComponent<
  InjectedLoadedComponentProps,
  LoadedComponentProps,
> {
  get _flowSensor(): ?FlowSensor {
    const { value: flowSensorLoaders } = this.props;
    return flowSensorLoaders.length === 0
      ? null
      : flowSensorLoaders[0].getValueEnforcing();
  }

  _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    const { navigation } = this.injectedProps;

    if (nullthrows(this._flowSensor).flowSensorType === values.flowSensorType) {
      const id = nullthrows(values.id);
      DAOApi.FlowSensorDAO.put(id, values);
      await waitForLoaded(() => FlowSensorStore.getByID(id));
    } else {
      DAOApi.FlowSensorDAO.post(values);
      // todo fix: if I wait for loading I get a warning about
      // updating state during rendering
      // probably related with observables
      // https://github.com/mobxjs/mobx-react#faq
      // await waitForLoaded(() => FlowSensorStore.getByID(clientID));
    }

    navigation.goBack();
  };

  render() {
    if (!this._flowSensor) {
      // todo redirect to newFlowSensorForm or render something reasonable
      return null;
    }

    return (
      <FlowSensorForm
        flowSensor={this._flowSensor}
        onSubmit={this._onFormSubmit}
        tapId={nullthrows(this._flowSensor).tap.id}
      />
    );
  }
}

export default EditFlowSensorScreen;
