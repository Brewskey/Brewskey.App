// @flow

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import Button from '../common/buttons/Button';
import TextBlock from '../common/TextBlock';
import { withNavigation } from 'react-navigation';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { COLORS, TYPOGRAPHY } from '../theme';
import HardwareSetupModal from './modals/HardwareSetupModal';
import ToggleStore from '../stores/ToggleStore';

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

@withNavigation
@observer
class NuxNoEntity extends InjectedComponent<InjectedProps> {
  _hardwareSetupToggleStore = new ToggleStore();

  _onGetStartedButtonPress = () => {
    this.injectedProps.navigation.navigate('wifiSetup', { forNewDevice: true });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headingText}>
          In order to use Brewskey you need to install the Brewskey hardware
        </Text>
        <Button
          onPress={this._hardwareSetupToggleStore.toggleOn}
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
          color={COLORS.textFaded}
          containerViewStyle={styles.getStartedButtonContainer}
          onPress={this._onGetStartedButtonPress}
          title="Get started"
        />
        <HardwareSetupModal
          isVisible={this._hardwareSetupToggleStore.isToggled}
          onHideModal={this._hardwareSetupToggleStore.toggleOff}
        />
      </View>
    );
  }
}

export default NuxNoEntity;
