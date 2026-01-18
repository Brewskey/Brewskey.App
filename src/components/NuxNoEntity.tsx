import * as React from 'react';
import { useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import Button from '../common/buttons/Button';
import TextBlock from '../common/TextBlock';

import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import HardwareSetupModal from './modals/HardwareSetupModal';
import { useGetLocations } from '../hooks/queries/LocationQueries';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
    // todo fix after https://github.com/Brewskey/Brewskey.App/issues/166
    // on rn0.56 probably
    height: Dimensions.get('window').height - 133,
  },
  getStartedButtonContainer: {
    marginTop: 30,
  },
  headingText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
    paddingHorizontal: 10,
    paddingVertical: 30,
    textAlign: 'center',
  },
  stepsContainer: {
    alignSelf: 'center',
  },
  stepsText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textInverse,
  },
});

const NuxNoEntity: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  const [isHardwareSetupVisible, setIsHardwareSetupVisible] = useState(false);
  
  // Get locations count for navigation logic
  const locationsQuery = useGetLocations({ take: 1 });
  const locationsCount = locationsQuery.data?.pages[0]?.length ?? 0;

  const onGetStartedButtonPress = () => {
    // Navigate to nuxLocation screen with locations count
    // Note: The original NuxSoftwareSetupStore.onGetStartedPress logic is commented out
    // The navigation flow will be handled by the screens themselves through their callbacks
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'nuxLocation',
        params: {
          locationsCount,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>
        In order to use Brewskey you need to install the Brewskey hardware
      </Text>
      <Button
        onPress={() => setIsHardwareSetupVisible(true)}
        secondary
        title="See instructions"
      />
      <Text style={styles.headingText}>and set up the Brewskey box by:</Text>
      <View style={styles.stepsContainer}>
        <TextBlock index={1} textStyle={styles.stepsText}>
          Create a location and set up the address
        </TextBlock>
        <TextBlock index={2} textStyle={styles.stepsText}>
          Connect the box to you local Wifi
        </TextBlock>
        <TextBlock index={3} textStyle={styles.stepsText}>
          Set up your taps
        </TextBlock>
        <TextBlock index={4} textStyle={styles.stepsText}>
          Assign a beverage to your tap
        </TextBlock>
      </View>
      <Button
        backgroundColor={COLORS.accent}
        color="white"
        containerStyle={styles.getStartedButtonContainer}
        onPress={onGetStartedButtonPress}
        title="Get started"
      />
      <HardwareSetupModal
        isVisible={isHardwareSetupVisible}
        onHideModal={() => setIsHardwareSetupVisible(false)}
      />
    </View>
  );
};

export default NuxNoEntity;
