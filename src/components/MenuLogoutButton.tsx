import * as React from 'react';

import Fragment from '../common/Fragment';
import LogoutModal from './modals/LogoutModal';
import ToggleStore from '../stores/ToggleStore';
import AuthStore from '../stores/AuthStore';
import MenuButton from './MenuButton';

class MenuLogoutButton extends React.Component<Record<any, any>> {
  _modalToggleStore = new ToggleStore();

  _onLogoutConform = () => {
    this._modalToggleStore.toggleOff();
    AuthStore.logout();
  };

  render(): React.ReactElement {
    return (
      <Fragment>
        <MenuButton
          icon={{ name: 'logout', type: 'material-community' }}
          onPress={this._modalToggleStore.toggleOn}
          title="Log Out"
        />
        <LogoutModal
          isVisible={this._modalToggleStore.isToggled}
          onCancelButtonPress={this._modalToggleStore.toggleOff}
          onLogoutButtonPress={this._onLogoutConform}
        />
      </Fragment>
    );
  }
}

export default MenuLogoutButton;
