import * as React from 'react';
import { useState } from 'react';

import { MenuButton } from 'components/MenuButton';
import { Fragment } from 'common/Fragment';
import { DeleteModal } from 'components/modals/DeleteModal';
import { useLogout } from 'hooks/queries/AuthQueries';

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
      <DeleteModal
        isVisible={isModalVisible}
        message="Are you sure you want to logout?"
        onCancelButtonPress={() => setIsModalVisible(false)}
        onDeleteButtonPress={onLogoutConfirm}
        title="Logout"
      />
    </Fragment>
  );
};

export { MenuLogoutButton };
