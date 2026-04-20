import * as React from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { Platform, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { Button } from 'common/buttons/Button';
import { FLOW_SENSOR_ITEMS } from 'components/FlowSensorForm/flowSensorItems';
import { FlowSensorSwiperItem } from 'components/FlowSensorForm/FlowSensorSwiperField/FlowSensorSwiperItem';

import type { FlowSensorType } from '@brewskey/js-api';
import type { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

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

interface PagerSwiperProps {
  currentIndex: number;
  onIndexChanged: (index: number) => void;
  children: React.ReactElement[];
}

const PagerSwiper: React.FC<PagerSwiperProps> = ({
  currentIndex,
  onIndexChanged,
  children,
}) => {
  const pagerRef = React.useRef<PagerView>(null);
  const lastReportedIndex = React.useRef(currentIndex);

  React.useEffect(() => {
    if (lastReportedIndex.current !== currentIndex) {
      pagerRef.current?.setPage(currentIndex);
      lastReportedIndex.current = currentIndex;
    }
  }, [currentIndex]);

  const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
    const next = event.nativeEvent.position;
    lastReportedIndex.current = next;
    if (next !== currentIndex) {
      onIndexChanged(next);
    }
  };

  return (
    <PagerView
      ref={pagerRef}
      initialPage={currentIndex}
      onPageSelected={handlePageSelected}
      style={styles.swiper}
      testID="flow-sensor-type-selector"
    >
      {children}
    </PagerView>
  );
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
          <PagerSwiper
            currentIndex={currentIndex < 0 ? 0 : currentIndex}
            onIndexChanged={onChangeCallback}
          >
            {items}
          </PagerSwiper>
        );
      }}
    />
  );
};
