// @flow

import type { FlowSensorType } from 'brewskey.js-api';

import * as React from 'react';
// import Swiper from '../../../common/Swiper';
import Swiper from 'react-native-swiper';
import { View, StyleSheet } from 'react-native';
import FlowSensorSwiperItem from './FlowSensorSwiperItem';
import FLOW_SENSOR_ITEMS from '../flowSensorItems';

const styles = StyleSheet.create({
  swiper: {
    height: 400,
  },
});

type Props = {|
  value: FlowSensorType,
  onChange: (value: FlowSensorType) => void,
|};

class FlowSensorSwiperField extends React.Component<Props> {
  get _index(): number {
    const { value } = this.props;
    const index = FLOW_SENSOR_ITEMS.findIndex(
      (flowSensorItem): boolean => flowSensorItem.value === value,
    );

    return index !== -1 ? index : 0;
  }

  _onIndexChanged = (index: number) => {
    const { onChange } = this.props;
    onChange(FLOW_SENSOR_ITEMS[index].value);
  };

  render(): React.Node {
    return ((
      <Swiper
        index={this._index}
        loop={false}
        onIndexChanged={this._onIndexChanged}
        style={styles.swiper}
      >
        {FLOW_SENSOR_ITEMS.map(
          ({ description, image, name, value }): React.Node => (
            <View key={value}>
              <FlowSensorSwiperItem
                description={description}
                image={image}
                title={name}
              />
            </View>
          ),
        )}
      </Swiper>
    ): any);
  }
}

export default FlowSensorSwiperField;
