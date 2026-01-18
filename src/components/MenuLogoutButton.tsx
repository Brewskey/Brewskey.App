import * as React from 'react';
import { useState } from 'react';

import Fragment from '../common/Fragment';
import LogoutModal from './modals/LogoutModal';
import { useAuthActions } from '../stores/AuthStore';
import MenuButton from './MenuButton';

const MenuLogoutButton: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { logout } = useAuthActions();

  const onLogoutConfirm = async () => {
    setIsModalVisible(false);
    await logout();
  };

  return (
    <Fragment>
      <MenuButton
        icon={{ name: 'logout', type: 'material-community' }}
        onPress={() => setIsModalVisible(true)}
        title="Log Out"
      />
      <LogoutModal
        isVisible={isModalVisible}
        onCancelButtonPress={() => setIsModalVisible(false)}
        onLogoutButtonPress={onLogoutConfirm}
      />
    </Fragment>
  );
};

export default MenuLogoutButton;
