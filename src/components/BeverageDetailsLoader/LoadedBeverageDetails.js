// @flow

import type { Beverage } from 'brewskey.js-api';

import * as React from 'react';
import { Dimensions, Text, StyleSheet, View } from 'react-native';
import SectionHeader from '../../common/SectionHeader';
import SectionContent from '../../common/SectionContent';
import CacheImage from '../../common/CachedImage';
import CONFIG from '../../config';
import { COLORS, TYPOGRAPHY } from '../../theme';
import OverviewItem from '../../common/OverviewItem';

const { width: screenWidth } = Dimensions.get('window');
const BEVERAGE_IMAGE_HORIZONTAL_MARGIN = 12;

const styles = StyleSheet.create({
  beverageImage: {
    alignSelf: 'center',
    borderColor: COLORS.secondary3,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: BEVERAGE_IMAGE_HORIZONTAL_MARGIN,
  },
  descriptionText: {
    ...TYPOGRAPHY.paragraph,
    paddingHorizontal: 12,
  },
});

type Props = {|
  value: Beverage,
|};

const LoadedBeverageDetails = ({
  value: { id, beverageType, description, name, style, glass, isOrganic },
}: Props) => {
  const beverageImageSize = screenWidth - BEVERAGE_IMAGE_HORIZONTAL_MARGIN * 2;

  return (
    <View>
      <SectionHeader title={name} />
      <SectionContent>
        <CacheImage
          style={[
            styles.beverageImage,
            {
              height: beverageImageSize,
              width: beverageImageSize,
            },
          ]}
          source={{
            uri: `${
              CONFIG.CDN
            }beverages/${id.toString()}-large.jpg?w=${beverageImageSize}&h=${beverageImageSize}&mode=crop`,
          }}
        />
        <Text style={styles.descriptionText}>{description}</Text>
        <OverviewItem title="Type" value={beverageType} />
        {style && <OverviewItem title="Style" value={style.name} />}
        {glass && <OverviewItem title="Glass" value={glass.name} />}
        <OverviewItem title="Organic?" value={isOrganic ? 'Yes' : 'No'} />
      </SectionContent>
    </View>
  );
};

export default LoadedBeverageDetails;
