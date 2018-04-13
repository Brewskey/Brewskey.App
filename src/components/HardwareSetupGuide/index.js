// @flow

import * as React from 'react';
import nullthrows from 'nullthrows';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { action, computed, observable } from 'mobx';
import Swiper from 'react-native-swiper';
import CutBeerLineImage from '../../resources/installation/1_cut-beer-line.png';
import InstallSensorImage from '../../resources/installation/2_install-sensor.png';
import DetachTowerImage from '../../resources/installation/3_detach-tower.png';
import SensorCableToBoxImage from '../../resources/installation/4_sensor-cable-to-box.png';
import AttachTowerImage from '../../resources/installation/5_attach-tower.png';
import PlugInImage from '../../resources/installation/6_plug-in.png';
import { COLORS } from '../../theme';
import Button from '../../common/buttons/Button';
import SetupStep from './SetupStep';

const styles = StyleSheet.create({
  activeDotStyle: {
    backgroundColor: COLORS.secondary,
    height: 10,
    width: 10,
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.primary3,
    flex: 1,
  },
  dotStyle: {
    height: 10,
    width: 10,
  },
  nextButtonContainer: {
    bottom: 15,
    position: 'absolute',
    right: 10,
  },
  paginationStyle: {
    bottom: 30,
  },
  skipButtonContainer: {
    bottom: 15,
    left: 10,
    position: 'absolute',
  },
});

const MAX_STEP_INDEX = 5;

type Props = {|
  onSkipPress: () => void,
  onFinishPress: () => void,
|};

@observer
class HardwareSetupGuide extends React.Component<Props> {
  _swiper: ?Swiper;

  @observable _stepIndex: number = 0;

  @computed
  get _isLastStep(): boolean {
    return this._stepIndex === MAX_STEP_INDEX;
  }

  @action
  _setStepIndex = (index: number) => {
    this._stepIndex = index;
  };

  _onNextButtonPress = () => {
    if (!this._isLastStep) {
      nullthrows(this._swiper).scrollBy(1);
    } else {
      this.props.onFinishPress();
    }
  };

  _setSwiperRef = ref => (this._swiper = ref);

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Swiper
          activeDotStyle={styles.activeDotStyle}
          dotStyle={styles.dotStyle}
          loop={false}
          onIndexChanged={this._setStepIndex}
          paginationStyle={styles.paginationStyle}
          ref={this._setSwiperRef}
        >
          <View style={styles.container}>
            <SetupStep
              description="To attach the flow sensor, cut your beer line near its midpoint."
              image={CutBeerLineImage}
              title="1. Cut your beer line"
            />
          </View>
          <View style={styles.container}>
            <SetupStep
              description={
                'Taking the two ends of the line you just cut, ' +
                'soak them in hot water for about a minute. ' +
                'Then, slide the pointed ends of the flow sensor on the beer line.'
              }
              image={InstallSensorImage}
              title="2. Install flow sensor"
            />
          </View>
          <View style={styles.container}>
            <SetupStep
              description={
                'Remove the screws holding up the kegerator tower ' +
                'and pick up the rubber ring underneath.'
              }
              image={DetachTowerImage}
              title="3. Detach kegerator tower"
            />
          </View>
          <View style={styles.container}>
            <SetupStep
              description={
                'Plug the flat cable into your Brewskey box ' +
                'and connect the other end into the flow sensor.'
              }
              image={SensorCableToBoxImage}
              title="4. Run cable from your brewskey box to sensor"
            />
          </View>
          <View style={styles.container}>
            <SetupStep
              description={
                'Make sure the Brewskey box is in good place ' +
                "because you won't be able to move it much. " +
                "Also, make sure the flat cable isn't pinched or twisted."
              }
              image={AttachTowerImage}
              title="5. Re-attach kegerator tower"
            />
          </View>
          <View style={styles.container}>
            <SetupStep
              description={
                "You're almost finished. Plug in the power cable " +
                'and the LED light should start blinking blue. ' +
                "This means it's ready for you to set up the WiFi."
              }
              image={PlugInImage}
              title="6. Plug in the Brewskey box"
            />
          </View>
        </Swiper>
        {!this._isLastStep && (
          <Button
            containerViewStyle={styles.skipButtonContainer}
            onPress={this.props.onSkipPress}
            title="SKIP"
            transparent
          />
        )}
        <Button
          containerViewStyle={styles.nextButtonContainer}
          onPress={this._onNextButtonPress}
          title={this._isLastStep ? 'FINISH' : 'NEXT'}
          transparent
        />
      </View>
    );
  }
}

export default HardwareSetupGuide;
