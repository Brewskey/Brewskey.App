// @flow

import type { Beverage } from 'brewskey.js-api';

import * as React from 'react';
import { Dimensions, Text, StyleSheet, View } from 'react-native';
import CacheImage from '../common/CachedImage';
import CONFIG from '../config';
import { COLORS, TYPOGRAPHY } from '../theme';
import OverviewItem from '../common/OverviewItem';
import Fragment from '../common/Fragment';
import LoadingIndicator from '../common/LoadingIndicator';

const { width: screenWidth } = Dimensions.get('window');
const BEVERAGE_IMAGE_HORIZONTAL_MARGIN = 12;

const styles = StyleSheet.create({
  beverageImage: {
    borderColor: COLORS.secondary3,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  descriptionText: {
    ...TYPOGRAPHY.paragraph,
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

type Props = {|
  beverage: Beverage,
|};

const BeverageDetailsContent = ({
  beverage: { beverageType, description, glass, id, isOrganic, style },
}: Props) => {
  const beverageImageSize = screenWidth - BEVERAGE_IMAGE_HORIZONTAL_MARGIN * 2;

  const sizeStyle = {
    height: beverageImageSize,
    width: beverageImageSize,
  };

  return (
    <Fragment>
      <View style={[styles.imageContainer, styles.beverageImage, sizeStyle]}>
        <CacheImage
          loadingIndicator={LoadingIndicator}
          style={[styles.beverageImage, sizeStyle]}
          source={{
            uri: `${
              CONFIG.CDN
            }beverages/${id.toString()}-large.jpg?w=${beverageImageSize}&h=${beverageImageSize}&mode=crop`,
          }}
        />
      </View>
      <Text style={styles.descriptionText}>{description}</Text>
      <OverviewItem title="Type" value={beverageType} />
      {style && <OverviewItem title="Style" value={style.name} />}
      {glass && <OverviewItem title="Glass" value={glass.name} />}
      <OverviewItem title="Organic?" value={isOrganic ? 'Yes' : 'No'} />
    </Fragment>
  );
};

export default BeverageDetailsContent;
