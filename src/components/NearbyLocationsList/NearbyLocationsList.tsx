import * as React from 'react';

import { useRouter } from 'expo-router';
import { View } from 'react-native';

import NearbyLocationsListEmpty from './NearbyLocationsListEmpty';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import Fragment from '../../common/Fragment';
import List from '../../common/List';
import ListItem from '../../common/ListItem';
import ListSectionHeader from '../../common/ListSectionHeader';
import ListSubSectionSeparator from '../../common/ListSubSectionSeparator';
import LoadingListFooter from '../../common/LoadingListFooter';
import { COLORS } from '../../theme';
import { calculateKegLevel } from '../../utils';

import type { SectionListData } from 'react-native';

import type { NearbyLocation, NearbyTap, Section } from '../../types';

interface Props {
  isLoading: boolean;
  nearbyLocations: NearbyLocation[] | undefined;
  onRefresh: () => void;
}

export const NearbyLocationsList: React.FC<Props> = ({
  nearbyLocations,
  isLoading,
  onRefresh,
}) => {
  const router = useRouter();
  const sections = (nearbyLocations ?? []).map(
    ({ name, taps }: NearbyLocation): Section<NearbyTap> => ({
      data: taps
        .slice()
        .sort(
          (a: NearbyTap, b: NearbyTap): number => a.device.id - b.device.id,
        ),
      title: name,
    }),
  );

  const keyExtractor = ({ id }: NearbyTap): string => id.toString();

  const onItemPress = ({ id }: NearbyTap) =>
    router.navigate({
      pathname: '/(tabs)/taps/[tapId]/on_tap',
      params: { tapId: String(id) },
    });

  const renderItem = ({
    index,
    item,
  }: {
    index: number;
    item: NearbyTap;
  }): React.ReactElement => {
    const {
      currentKeg,
      device: { name: deviceName },
      name,
      tapNumber,
    } = item;

    const kegLevel = currentKeg
      ? calculateKegLevel(currentKeg).toFixed(0)
      : null;

    const beverageName = currentKeg
      ? currentKeg.beverageName
      : 'No Beer on Tap';

    const showTopSeparator = index !== 0 && tapNumber === 1;

    return (
      <Fragment>
        {showTopSeparator ? <ListSubSectionSeparator /> : null}
        <ListItem
          chevron={false}
          item={item}
          onPress={onItemPress}
          subtitle={(name?.trim().length ? `${name} - ` : '') + deviceName}
          title={`${tapNumber} - ${beverageName}`}
          badge={
            kegLevel !== null
              ? {
                  badgeStyle: { backgroundColor: COLORS.accent },
                  value: `${kegLevel}%`,
                }
              : undefined
          }
          leftAvatar={
            <BeverageAvatar
              beverageId={currentKeg ? currentKeg.beverageId : ''}
            />
          }
        />
      </Fragment>
    );
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<NearbyTap>;
  }): React.ReactElement => <ListSectionHeader title={section.title} />;

  return (
    <View style={{ flex: 1 }} testID="nearby-locations-list">
      <List
        keyExtractor={keyExtractor}
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        listType="sectionList"
        onRefresh={onRefresh}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={sections}
        ListEmptyComponent={
          !isLoading ? <NearbyLocationsListEmpty /> : undefined
        }
      />
    </View>
  );
};

export default NearbyLocationsList;
