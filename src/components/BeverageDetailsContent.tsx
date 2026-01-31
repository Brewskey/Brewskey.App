import * as React from 'react';

import { Image } from 'expo-image';
import {
  Dimensions,
  Image as RNImage,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Fragment } from 'common/Fragment';
import { OverviewItem } from 'common/OverviewItem';
import { CONFIG } from 'config';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { Beverage } from '@brewskey/js-api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BEVERAGE_IMAGE_HORIZONTAL_MARGIN = 12;
const BEVERAGE_IMAGE_SIZE = SCREEN_WIDTH - BEVERAGE_IMAGE_HORIZONTAL_MARGIN * 2;

const styles = StyleSheet.create({
  beverageImage: {
    borderColor: COLORS.secondary3,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  descriptionText: {
    ...TYPOGRAPHY.paragraph,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  imageContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.secondary2,
    borderColor: COLORS.secondary3,
    marginBottom: 12,
    marginHorizontal: BEVERAGE_IMAGE_HORIZONTAL_MARGIN,
    overflow: 'hidden',
  },
});

interface Props {
  beverage: Beverage;
}

interface State {
  height: number;
  width: number;
}

const BeverageDetailsContent: React.FC<Props> = ({ beverage }) => {
  const [imageSize, setImageSize] = React.useState<State>({
    height: 0,
    width: BEVERAGE_IMAGE_SIZE,
  });

  const getURI = React.useCallback(
    () =>
      `${
        CONFIG.CDN
      }beverages/${beverage.id.toString()}-large.jpg?w=${BEVERAGE_IMAGE_SIZE}&trim.threshold=80&mode=crop`,
    [beverage.id],
  );

  React.useEffect(() => {
    RNImage.getSize(getURI(), (width, height) => {
      const calculatedHeight = (BEVERAGE_IMAGE_SIZE / width) * height;
      setImageSize({
        height: Math.min(calculatedHeight, BEVERAGE_IMAGE_SIZE * 1.5),
        width: BEVERAGE_IMAGE_SIZE,
      });
    });
  }, [getURI]);

  const { beverageType, description, glass, isOrganic, style, srm } = beverage;

  return (
    <Fragment>
      <View
        style={[styles.imageContainer, styles.beverageImage, imageSize]}
        testID="beverage-image"
      >
        <Image
          style={[styles.beverageImage, imageSize]}
          source={{
            uri: getURI(),
          }}
        />
      </View>
      <Text style={styles.descriptionText} testID="beverage-name">
        {beverage.name}
      </Text>
      <Text style={styles.descriptionText} testID="beverage-description">
        {description}
      </Text>
      <OverviewItem title="Type" value={beverageType} />
      {style ? <OverviewItem title="Style" value={style.name} /> : null}
      {glass ? <OverviewItem title="Glass" value={glass.name} /> : null}
      <OverviewItem title="Organic?" value={isOrganic ? 'Yes' : 'No'} />
      {srm ? (
        <OverviewItem
          title="SRM"
          value={
            <View
              style={{
                backgroundColor: `#${srm.hex}`,
                borderRadius: 12,
                height: 24,
                width: 24,
              }}
            />
          }
        />
      ) : null}
    </Fragment>
  );
};

export { BeverageDetailsContent };
