// @flow

import type { EntityID, Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { TapStore } from '../stores/DAOStores';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Container from '../common/Container';
import Button from '../common/buttons/Button';
import LoaderComponent from '../common/LoaderComponent';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapForm from '../components/TapForm';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class EditTapScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: TapMutator): Promise<void> => {
    DAOApi.TapDAO.put(nullthrows(values.id), values);
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
        <LoaderComponent
          loadedComponent={LoadedComponent}
          loader={TapStore.getByID(id)}
          onFormSubmit={this._onFormSubmit}
          onUpdateFlowSensorButtonPress={this._onUpdateFlowSensorButtonPress}
        />
      </Container>
    );
  }
}

type LoadedComponentProps = {
  onFormSubmit: (values: TapMutator) => Promise<void>,
  onUpdateFlowSensorButtonPress: () => void,
  value: Tap,
};

const LoadedComponent = ({
  onFormSubmit,
  onUpdateFlowSensorButtonPress,
  value,
}: LoadedComponentProps) => (
  <Container>
    <KeyboardAwareScrollView>
      <TapForm
        onSubmit={onFormSubmit}
        submitButtonLabel="Edit tap"
        tap={value}
      />
      <Button
        onPress={onUpdateFlowSensorButtonPress}
        title="Update flow sensor"
      />
    </KeyboardAwareScrollView>
  </Container>
);

export default EditTapScreen;
