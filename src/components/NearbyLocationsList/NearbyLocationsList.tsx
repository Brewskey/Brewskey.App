import type { NearbyLocation, NearbyTap, Section } from '../../types';

import * as React from 'react';
import Fragment from '../../common/Fragment';
import ListSubSectionSeparator from '../../common/ListSubSectionSeparator';

import List from '../../common/List';
import ListItem from '../../common/ListItem';
import NearbyLocationsListEmpty from './NearbyLocationsListEmpty';
import LoadingListFooter from '../../common/LoadingListFooter';
import ListSectionHeader from '../../common/ListSectionHeader';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import { calculateKegLevel } from '../../utils';
import { COLORS } from '../../theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SectionListData } from 'react-native';

type Props = {
  isLoading: boolean;
  nearbyLocations: NearbyLocation[] | undefined;
  onRefresh: () => void;
};

export const NearbyLocationsList: React.FC<Props> = ({
  nearbyLocations,
  isLoading,
  onRefresh,
}) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
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
    navigation.navigate('LoggedInStack', {
      screen: 'home',
      params: {
        screen: 'tapDetails',
        params: {
          tapId: id,
        },
      },
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
          leftAvatar={
            <BeverageAvatar
              beverageId={currentKeg ? currentKeg.beverageId : ''}
            />
          }
          badge={
            kegLevel !== null
              ? {
                  badgeStyle: { backgroundColor: COLORS.accent },
                  value: `${kegLevel}%`,
                }
              : undefined
          }
          chevron={false}
          item={item}
          onPress={onItemPress}
          title={`${tapNumber} - ${beverageName}`}
          subtitle={
            (name != null && name.trim().length ? `${name} - ` : '') +
            deviceName
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
    <List
      keyExtractor={keyExtractor}
      ListEmptyComponent={!isLoading ? <NearbyLocationsListEmpty /> : null}
      ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
      listType="sectionList"
      onRefresh={onRefresh}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
    />
  );
};

export default NearbyLocationsList;
