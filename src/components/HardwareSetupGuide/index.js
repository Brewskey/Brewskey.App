// @flow

import * as React from 'react';
import nullthrows from 'nullthrows';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { action, computed, observable } from 'mobx';
import Swiper from 'react-native-swiper';
import { COLORS } from '../../theme';
import Button from '../../common/buttons/Button';
import SETUP_STEPS from './setupSteps';

const styles = StyleSheet.create({
  activeDotStyle: {
    backgroundColor: COLORS.secondary,
    height: 10,
    width: 10,
  },
  closeButtonContainer: {
    bottom: 15,
    left: 10,
    position: 'absolute',
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
});

type Props = {|
  onClosePress: () => void,
|};

@observer
class HardwareSetupGuide extends React.Component<Props> {
  _swiper: ?Swiper;

  @observable _stepIndex: number = 0;

  @computed
  get _isLastStep(): boolean {
    return this._stepIndex === SETUP_STEPS.length - 1;
  }

  @action
  _setStepIndex = (index: number) => {
    this._stepIndex = index;
  };

  _onNextButtonPress = () => {
    if (!this._isLastStep) {
      nullthrows(this._swiper).scrollBy(1);
    } else {
      this.props.onClosePress();
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
          {SETUP_STEPS.map(
            (
              setupStep: React.Element<any>,
              index: number,
            ): React.Element<any> => (
              // eslint-disable-next-line react/no-array-index-key
              <View key={index} style={styles.container}>
                {setupStep}
              </View>
            ),
          )}
        </Swiper>
        {!this._isLastStep && (
          <Button
            containerViewStyle={styles.closeButtonContainer}
            onPress={this.props.onClosePress}
            title="CLOSE"
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
