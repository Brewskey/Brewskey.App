import * as React from 'react';
import { useState } from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import MyFriendsMainRoute from './myFriendsMain';
import MyFriendsRequestRoute from './myFriendsRequest';
import { Container } from '../../../../common/Container';
import { withErrorBoundary } from '../../../../common/ErrorBoundary';
import { ErrorScreen } from '../../../../common/ErrorScreen';
import { Header } from '../../../../common/Header';
import { HeaderIconButton } from '../../../../common/Header/HeaderIconButton';
import { FriendAddCustomModal } from '../../../../components/modals/FriendAddCustomModal';
import { useAddSnackBarMessage } from '../../../../hooks/context/SnackBarContext';
import { useAddFriend } from '../../../../hooks/queries/FriendQueries';
import { theme } from '../../../../theme';

import type { FriendAddFormValues } from '../../../../components/FriendAddForm';

const MyFriendsNavigator = createMaterialTopTabNavigator();

const MyFriendsLayout: React.FC = () => {
  const [isFriendModalVisible, setIsFriendModalVisible] = useState(false);
  const addFriendMutation = useAddFriend();
  const addSnackBarMessage = useAddSnackBarMessage();

  const onFriendAddFormSubmit = async ({ userName }: FriendAddFormValues) => {
    await addFriendMutation.mutateAsync(userName);
    setIsFriendModalVisible(false);
    addSnackBarMessage({
      content: `You requested a friendship with ${userName}`,
    });
  };

  return (
    <Container>
      <Header
        shouldShowBackButton
        title="Friends"
        rightComponent={
          <HeaderIconButton
            name="person-add"
            onPress={() => setIsFriendModalVisible(true)}
            type="material-icons"
          />
        }
      />
      <MyFriendsNavigator.Navigator
        screenOptions={{
          ...theme.tabBar,
          lazy: true,
        }}
      >
        <MyFriendsNavigator.Screen
          component={MyFriendsMainRoute}
          name="myFriendsMain"
        />
        <MyFriendsNavigator.Screen
          component={MyFriendsRequestRoute}
          name="myFriendsRequest"
        />
      </MyFriendsNavigator.Navigator>
      <FriendAddCustomModal
        isVisible={isFriendModalVisible}
        onFriendAddFormSubmit={onFriendAddFormSubmit}
        onHideModal={() => setIsFriendModalVisible(false)}
      />
    </Container>
  );
};

export default withErrorBoundary(
  MyFriendsLayout,
  <ErrorScreen shouldShowBackButton />,
);
