import type { FlowSensorType } from '@brewskey/js-api';

import * as React from 'react';
// import Swiper from '../../../common/Swiper';
import Swiper from 'react-native-swiper';
import { View, StyleSheet, Platform } from 'react-native';
import FlowSensorSwiperItem from './FlowSensorSwiperItem';
import FLOW_SENSOR_ITEMS, { FlowSensorItem } from '../flowSensorItems';
import { useFormContext, Controller } from 'react-hook-form';
import Button from '../../../common/buttons/Button';
import { ButtonGroup } from '@rneui/themed';

const styles = StyleSheet.create({
  swiper: {
    height: 400,
  },
});

type Props = {
  onChange: (value: FlowSensorType) => void;
  required?: boolean;
  name: string;
};

export const FlowSensorSwiperField: React.FC<Props> = ({
  onChange,
  required,
  name,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required }}
      defaultValue={FLOW_SENSOR_ITEMS[0].value}
      render={({ field: { onChange: onChangeController, value } }) => {
        const currentIndex = FLOW_SENSOR_ITEMS.findIndex(
          (item) => item.value === value,
        );

        const items = FLOW_SENSOR_ITEMS.map(
          ({
            description,
            image,
            name: title,
            value: itemValue,
          }): React.ReactElement => (
            <View key={itemValue}>
              <FlowSensorSwiperItem
                description={description}
                image={image}
                title={title}
              />
            </View>
          ),
        );

        const onChangeCallback = (index: number) => {
          const item = FLOW_SENSOR_ITEMS[index];
          console.log('onChange', item.value);
          onChange(item.value);
          onChangeController(item.value);
        };

        if (Platform.OS === 'web') {
          return (
            <View testID="flow-sensor-type-selector">
              {items[currentIndex]}
              <View style={{ flexDirection: 'row', marginVertical: 12 }}>
                <Button
                  title="Previous"
                  containerStyle={{ flex: 1 }}
                  disabled={currentIndex === 0}
                  testID="button-flow-sensor-previous"
                  onPress={() => onChangeCallback(currentIndex - 1)}
                />
                <Button
                  title="Next"
                  containerStyle={{ flex: 1 }}
                  disabled={currentIndex === FLOW_SENSOR_ITEMS.length - 1}
                  testID="button-flow-sensor-next"
                  onPress={() => onChangeCallback(currentIndex + 1)}
                />
              </View>
            </View>
          );
        }

        return (
          <Swiper
            index={currentIndex}
            loop={false}
            onIndexChanged={onChangeCallback}
            style={styles.swiper}
            testID="flow-sensor-type-selector"
          >
            {items}
          </Swiper>
        );
      }}
    />
  );
};

export default FlowSensorSwiperField;
