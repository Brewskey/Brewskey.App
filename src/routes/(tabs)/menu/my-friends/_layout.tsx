import type { FriendAddFormValues } from '../../../../components/FriendAddForm';

import * as React from 'react';
import { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ErrorScreen from '../../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../../common/ErrorBoundary';
import Container from '../../../../common/Container';
import Header from '../../../../common/Header';
import { HeaderIconButton } from '../../../../common/Header/HeaderIconButton';
import MyFriendsMainRoute from './myFriendsMain';
import MyFriendsRequestRoute from './myFriendsRequest';
import FriendAddCustomModal from '../../../../components/modals/FriendAddCustomModal';
import theme from '../../../../theme';
import { useAddSnackBarMessage } from '../../../../hooks/context/SnackBarContext';
import { useAddFriend } from '../../../../hooks/queries/FriendQueries';

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
        rightComponent={
          <HeaderIconButton
            name="person-add"
            onPress={() => setIsFriendModalVisible(true)}
            testID="button-add-friend"
            type="material-icons"
          />
        }
        shouldShowBackButton
        title="Friends"
      />
      <MyFriendsNavigator.Navigator
        screenOptions={{
          ...theme.tabBar,
          lazy: true,
        }}
      >
        <MyFriendsNavigator.Screen
          name="myFriendsMain"
          component={MyFriendsMainRoute}
        />
        <MyFriendsNavigator.Screen
          name="myFriendsRequest"
          component={MyFriendsRequestRoute}
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

export default withErrorBoundary(MyFriendsLayout, <ErrorScreen shouldShowBackButton />);
