import * as React from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { Platform, StyleSheet, View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { SwipePager } from 'common/SwipePager';
import { FLOW_SENSOR_ITEMS } from 'components/FlowSensorForm/flowSensorItems';
import { FlowSensorSwiperItem } from 'components/FlowSensorForm/FlowSensorSwiperField/FlowSensorSwiperItem';

import type { FlowSensorType } from '@brewskey/js-api';

const styles = StyleSheet.create({
  swiper: {
    height: 400,
  },
  webButtonRow: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  webButton: {
    flex: 1,
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
        const currentIndex = Math.max(
          0,
          FLOW_SENSOR_ITEMS.findIndex((item) => item.value === value),
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

        return (
          <View>
            <SwipePager
              currentIndex={currentIndex}
              onIndexChanged={onChangeCallback}
              style={styles.swiper}
              testID="flow-sensor-type-selector"
            >
              {items}
            </SwipePager>
            {Platform.OS === 'web' && (
              <View style={styles.webButtonRow}>
                <Button
                  containerStyle={styles.webButton}
                  disabled={currentIndex === 0}
                  onPress={() => onChangeCallback(currentIndex - 1)}
                  testID="button-flow-sensor-previous"
                  title="Previous"
                />
                <Button
                  containerStyle={styles.webButton}
                  disabled={currentIndex === FLOW_SENSOR_ITEMS.length - 1}
                  onPress={() => onChangeCallback(currentIndex + 1)}
                  testID="button-flow-sensor-next"
                  title="Next"
                />
              </View>
            )}
          </View>
        );
      }}
    />
  );
};
