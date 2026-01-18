import type { FriendAddFormValues } from '../components/FriendAddForm';

import * as React from 'react';
import { useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import { HeaderIconButton } from '../common/Header/HeaderIconButton';
import MyFriendsMainScreen from './MyFriendsMainScreen';
import MyFriendsRequestScreen from './MyFriendsRequestScreen';
import FriendAddCustomModal from '../components/modals/FriendAddCustomModal';
import theme from '../theme';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { useAddFriend } from '../hooks/queries/FriendQueries';

/* eslint-disable sorting/sort-object-props */
const MyFriendsNavigator = createMaterialTopTabNavigator();

const MyFriendsNavigatorScreen = () => (
  <MyFriendsNavigator.Navigator
    screenOptions={{
      ...theme.tabBar,
      lazy: true,
    }}
  >
    <MyFriendsNavigator.Screen
      name="myFriendsMain"
      component={MyFriendsMainScreen}
    />
    <MyFriendsNavigator.Screen
      name="myFriendsRequest"
      component={MyFriendsRequestScreen}
    />
  </MyFriendsNavigator.Navigator>
);
 

const MyFriendsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  const [isFriendModalVisible, setIsFriendModalVisible] = useState(false);
  const addFriendMutation = useAddFriend();
  const addSnackBarMessage = useAddSnackBarMessage();

  const onFriendAddFormSubmit = async ({ userName }: FriendAddFormValues) => {
    await addFriendMutation.mutateAsync(userName);
    setIsFriendModalVisible(false);
    // Navigate to the myFriendsRequest tab within the same screen
    // Since this is a tab navigator within the screen, we can use the tab navigator's navigation
    // However, since we're using a MaterialTopTabNavigator, we need to check if there's a way to navigate to tabs
    // For now, the tab navigator should handle this automatically when the screen re-renders
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
            type="material-icons"
          />
        }
        showBackButton
        title="Friends"
      />
      <MyFriendsNavigatorScreen />
      <FriendAddCustomModal
        isVisible={isFriendModalVisible}
        onFriendAddFormSubmit={onFriendAddFormSubmit}
        onHideModal={() => setIsFriendModalVisible(false)}
      />
    </Container>
  );
};

export default withErrorBoundary(MyFriendsScreen, <ErrorScreen showBackButton />);
