import * as React from 'react';

// import Swiper from '../../../common/Swiper';
import { Controller, useFormContext } from 'react-hook-form';
import { Platform, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';

import { FlowSensorSwiperItem } from './FlowSensorSwiperItem';
import { Button } from '../../../common/buttons/Button';
import { FLOW_SENSOR_ITEMS } from '../flowSensorItems';

import type { FlowSensorType } from '@brewskey/js-api';

const styles = StyleSheet.create({
  swiper: {
    height: 400,
  },
});

interface Props {
  onChange: (value: FlowSensorType) => void;
  required?: boolean;
  name: string;
}

export const FlowSensorSwiperField: React.FC<Props> = ({
  onChange,
  required,
  name,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={FLOW_SENSOR_ITEMS[0].value}
      name={name}
      rules={{ required }}
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
          onChange(item.value);
          onChangeController(item.value);
        };

        if (Platform.OS === 'web') {
          return (
            <View testID="flow-sensor-type-selector">
              {items[currentIndex]}
              <View style={{ flexDirection: 'row', marginVertical: 12 }}>
                <Button
                  containerStyle={{ flex: 1 }}
                  disabled={currentIndex === 0}
                  onPress={() => onChangeCallback(currentIndex - 1)}
                  testID="button-flow-sensor-previous"
                  title="Previous"
                />
                <Button
                  containerStyle={{ flex: 1 }}
                  disabled={currentIndex === FLOW_SENSOR_ITEMS.length - 1}
                  onPress={() => onChangeCallback(currentIndex + 1)}
                  testID="button-flow-sensor-next"
                  title="Next"
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
