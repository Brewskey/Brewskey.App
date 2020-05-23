// @flow

import type { EntityID, LoadObject, Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { TapStore } from '../stores/DAOStores';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import NotificationsStore from '../stores/NotificationsStore';
import Container from '../common/Container';
import Section from '../common/Section';
import { ListItem } from 'react-native-elements';
import LoaderComponent from '../common/LoaderComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapForm from '../components/TapForm';
import SnackBarStore from '../stores/SnackBarStore';

type InjectedProps = {|
  tapId: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen />)
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
    await DAOApi.TapDAO.waitForLoaded((dao) => dao.fetchByID(id));
    SnackBarStore.showMessage({ text: 'The tap edited' });
  };

  render(): React.Node {
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
  onToggleNotifications: () => void,
  value: Tap,
};

@observer
class LoadedTapComponent extends React.Component<LoadedTapComponentProps> {
  _onToggleNotifications = () =>
    NotificationsStore.toggleNotificationsForTap(this.props.value.id);

  render(): React.Node {
    const { onTapFormSubmit, value } = this.props;
    return (
      <Container>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <Section bottomPadded>
            <ListItem
              chevron={false}
              switch={{
                onValueChange: this._onToggleNotifications,
                value: NotificationsStore.getIsNotificationsEnabledForTap(
                  value.id,
                ),
              }}
              title="Notifications"
            />
          </Section>
          <TapForm
            onSubmit={onTapFormSubmit}
            submitButtonLabel="Edit tap"
            tap={value}
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default EditTapScreen;
