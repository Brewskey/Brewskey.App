import * as React from 'react';
import { useState } from 'react';

import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { HeaderIconButton } from 'common/Header/HeaderIconButton';
import { FriendAddCustomModal } from 'components/modals/FriendAddCustomModal';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useAddFriend } from 'hooks/queries/FriendQueries';
import { theme } from 'theme';

import MyFriendsMainRoute from './myFriendsMain';
import MyFriendsRequestRoute from './myFriendsRequest';

import type { FriendAddFormValues } from 'components/FriendAddForm';

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
            testID="button-add-friend"
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
          options={{
            title: 'Friends',
          }}
        />
        <MyFriendsNavigator.Screen
          component={MyFriendsRequestRoute}
          name="myFriendsRequest"
          options={{
            title: 'Requests',
          }}
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

export default MyFriendsLayout;
