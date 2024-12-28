import type { EntityID, FlowSensor, FlowSensorMutator } from '@brewskey/js-api';

import * as React from 'react';
import nullthrows from 'nullthrows';

import DAOApi from '@brewskey/js-api';
import { computed } from 'mobx';

import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';

import { FlowSensorStore } from '../stores/DAOStores';
import FlowSensorForm from '../components/FlowSensorForm';
import LoaderComponent from '../common/LoaderComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import SnackBarStore from '../hooks/context/SnackBarContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type InjectedProps = {
  navigation: Navigation;
  tapId: EntityID;
};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class EditFlowSensorScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Flow Sensor',
  };

  get _flowSensorLoader(): LoadObject<FlowSensor> {
    const { tapId } = this.injectedProps;
    return FlowSensorStore.getSingle({
      filters: [DAOApi.createFilter('tap/id').equals(tapId)],
    });
  }

  render(): React.ReactElement {
    const { tapId } = this.injectedProps;
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <LoaderComponent
          emptyComponent={EmptyComponent}
          loadedComponent={LoadedComponent}
          loader={this._flowSensorLoader}
          tapId={tapId}
          updatingComponent={LoadedComponent}
        />
      </KeyboardAwareScrollView>
    );
  }
}

type ExtraProps = {
  tapId: EntityID;
};

type LoadedComponentProps = {
  value: FlowSensor;
} & ExtraProps;

type InjectedLoadedComponentProps = {
  navigation: Navigation;
};

@withNavigation
class LoadedComponent extends InjectedComponent<
  InjectedLoadedComponentProps,
  LoadedComponentProps
> {
  _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    const { value: initialFlowSensor } = this.props;

    if (initialFlowSensor.flowSensorType === values.flowSensorType) {
      const id = nullthrows(values.id);
      DAOApi.FlowSensorDAO.put(id, values);
      await DAOApi.FlowSensorDAO.waitForLoaded((dao) => dao.fetchByID(id));
    } else {
      const clientID = DAOApi.FlowSensorDAO.post(values);
      await DAOApi.FlowSensorDAO.waitForLoaded((dao) =>
        dao.fetchByID(clientID),
      );
    }
    SnackBarStore.showMessage({ text: 'The flow sensor set' });
  };

  render(): React.ReactElement {
    const { tapId, value } = this.props;
    return (
      <FlowSensorForm
        flowSensor={value}
        onSubmit={this._onFormSubmit}
        tapId={tapId}
      />
    );
  }
}

@withNavigation
class EmptyComponent extends InjectedComponent<
  ExtraProps,
  LoadedComponentProps
> {
  _onFormSubmit = async (values: FlowSensorMutator): Promise<void> => {
    const clientID = DAOApi.FlowSensorDAO.post(values);
    await DAOApi.FlowSensorDAO.waitForLoaded((dao) => dao.fetchByID(clientID));
  };

  render(): React.ReactElement {
    const { tapId } = this.injectedProps;
    return <FlowSensorForm onSubmit={this._onFormSubmit} tapId={tapId} />;
  }
}

export default EditFlowSensorScreen;
