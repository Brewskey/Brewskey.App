// @flow

import type { Beverage } from 'brewskey.js-api';

import * as React from 'react';
import { Dimensions, Text, StyleSheet, View } from 'react-native';
import SectionHeader from '../../common/SectionHeader';
import SectionContent from '../../common/SectionContent';
import CacheImage from '../../common/CachedImage';
import CONFIG from '../../config';
import { TYPOGRAPHY } from '../../theme';
import OverviewItem from '../../common/OverviewItem';

const { width: screenWidth } = Dimensions.get('window');
const BEVERAGE_IMAGE_HEIGHT_COEFFICIENT = 0.75;

const styles = StyleSheet.create({
  descriptionText: {
    ...TYPOGRAPHY.paragraph,
    paddingHorizontal: 15,
  },
});

type Props = {|
  value: Beverage,
|};

const LoadedBeverageDetails = ({
  value: { id, beverageType, description, name, style, glass, isOrganic },
}: Props) => {
  const beverageImageWidth = screenWidth;
  const beverageImageHeight =
    beverageImageWidth * BEVERAGE_IMAGE_HEIGHT_COEFFICIENT;

  return (
    <View>
      <SectionHeader title={name} />
      <SectionContent>
        <CacheImage
          style={{
            height: screenWidth * 0.75,
            width: screenWidth,
          }}
          source={{
            uri: `${
              CONFIG.CDN
            }beverages/${id.toString()}-icon.jpg?w=${beverageImageWidth}&h=${beverageImageHeight}&mode=crop`,
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
