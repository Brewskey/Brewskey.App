import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TYPOGRAPHY } from '../../../theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  description: { ...TYPOGRAPHY.paragraph },
  image: { height: 300, width: '100%' },
  title: { ...TYPOGRAPHY.heading },
});

type Props = {
  description: string,
  image: number | null | undefined,
  title: string
};

const FlowSensorSwiperItem = (
  {
    description,
    image,
    title,
  }: Props,
): React.ReactElement => <View style={styles.container}>
  <Text style={styles.title}>{title}</Text>
  <Image source={image} style={styles.image} resizeMode="contain" />
  <Text style={styles.description}>{description}</Text>
</View>;

export default FlowSensorSwiperItem;
