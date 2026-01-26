import * as React from 'react';
import { useState } from 'react';

import MenuButton from './MenuButton';
import Fragment from '../common/Fragment';
import LogoutModal from './modals/LogoutModal';
import { useLogout } from '../hooks/queries/AuthQueries';

const MenuLogoutButton: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const logoutMutation = useLogout();
  const onLogoutConfirm = async () => {
    setIsModalVisible(false);
    await logoutMutation.mutateAsync();
  };

  return (
    <Fragment>
      <MenuButton
        icon={{ name: 'logout', type: 'material-community' }}
        onPress={() => setIsModalVisible(true)}
        testID="menu-item-logout"
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
