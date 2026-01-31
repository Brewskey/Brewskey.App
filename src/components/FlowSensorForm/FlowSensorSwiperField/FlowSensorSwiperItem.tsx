import * as React from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

import { TYPOGRAPHY } from 'theme';

import type { ImageSourcePropType } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  description: { ...TYPOGRAPHY.paragraph },
  image: { height: 300, width: '100%' },
  title: { ...TYPOGRAPHY.heading },
});

interface Props {
  description: string;
  image: ImageSourcePropType | undefined;
  title: string;
}

const FlowSensorSwiperItem = ({
  description,
  image,
  title,
}: Props): React.ReactElement => (
  <View
    style={styles.container}
    testID={`flow-sensor-item-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    <Text
      style={styles.title}
      testID={`flow-sensor-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {title}
    </Text>
    <Image resizeMode="contain" source={image} style={styles.image} />
    <Text style={styles.description}>{description}</Text>
  </View>
);

export { FlowSensorSwiperItem };
