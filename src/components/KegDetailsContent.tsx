import type { EntityID, Keg, Pour } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ListRenderItemInfo } from 'react-native';
import { useRouter } from 'expo-router';
import moment from 'moment';
import { COLORS, TYPOGRAPHY } from '../theme';
import { createFilter } from '@brewskey/js-api/dist/filters';
import OverviewItem from '../common/OverviewItem';
import Fragment from '../common/Fragment';
import { calculateKegLevel } from '../utils';
import { NULL_STRING_PLACEHOLDER, KEG_NAME_BY_KEG_TYPE } from '../constants';
import { useGetPours } from '../hooks/queries/PourQueries';
import ListItem from '../common/ListItem';
import UserAvatar from '../common/avatars/UserAvatar';
import LoadingListFooter from '../common/LoadingListFooter';
import ListEmpty from '../common/ListEmpty';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';
import { BeverageDetailsLoader } from './BeverageDetailsLoader';
import List from '../common/List';
import PintCounter from './PintCounter';

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.secondary3,
    backgroundColor: COLORS.secondary,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    ...TYPOGRAPHY.secondary,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: COLORS.accent,
  },
  tabContent: {
    flex: 1,
    minHeight: 0,
  },
  detailsScrollView: {
    flex: 1,
  },
  poursListContainer: {
    flex: 1,
  },
});

type Props = {
  keg: Keg;
  onClose?: () => void;
};

const PourRow: React.FC<{ 
  pour: Pour; 
  beverageId: EntityID | undefined;
  onPress?: (pour: Pour) => void;
}> = ({ pour, beverageId, onPress }) => {
  const pourOwnerUserName = pour.owner
    ? pour.owner.userName
    : NULL_STRING_PLACEHOLDER;
  const title = pour.owner
    ? `${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`
    : `${pour.ounces.toFixed(1)} oz`;

  const handlePress = () => {
    if (onPress && pour.owner) {
      onPress(pour);
    }
  };

  return (
    <ListItem
      chevron={false}
      leftAvatar={<UserAvatar userName={pourOwnerUserName} />}
      item={pour}
      title={title}
      subtitle={moment(pour.pourDate).fromNow()}
      rightIcon={
        <PintCounter beverageID={beverageId} ounces={pour.ounces} />
      }
      onPress={pour.owner ? handlePress : undefined}
    />
  );
};

type TabButtonProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
};

const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onPress }) => {
  const testID = `keg-details-tab-${title.toLowerCase()}`;
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
      testID={testID}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const KegPoursList: React.FC<{ 
  kegId: EntityID; 
  beverageId: EntityID | undefined;
  onClose?: () => void;
}> = ({ kegId, beverageId, onClose }) => {
  const router = useRouter();
  const pours = useGetPours({
    filters: [createFilter('keg/id').equals(kegId)],
    orderBy: [{ column: 'id', direction: 'desc' }],
  });

  const handleItemPress = (pour: Pour) => {
    if (!pour.owner) {
      return;
    }

    onClose?.();
    router.navigate(`/(tabs)/profile/${pour.owner.id}`);
  };

  const keyExtractor = (pour: Pour): string => pour.id.toString();

  const renderRow = ({ item }: ListRenderItemInfo<Pour>): React.ReactElement => (
    <PourRow pour={item} beverageId={beverageId} onPress={handleItemPress} />
  );

  return (
    <List
      data={pours.data}
      keyExtractor={keyExtractor}
      listType="flatList"
      ListEmptyComponent={!pours.isLoading ? <ListEmpty message="No pours" /> : null}
      ListFooterComponent={<LoadingListFooter isLoading={pours.isFetchingNextPage || pours.isLoading} />}
      onEndReached={() => {
        if (pours.hasNextPage) {
          pours.fetchNextPage();
        }
      }}
      onRefresh={pours.refetch}
      renderItem={renderRow}
    />
  );
};

const KegDetailsContent: React.FC<Props> = ({ keg, onClose }) => {
  const {
    beverage,
    kegType,
    maxOunces,
    ounces,
    tapDate,
    floatedDate,
    location,
    pulses,
  } = keg;

  const [activeTab, setActiveTab] = React.useState<'details' | 'pours'>('details');

  const kegLevel = calculateKegLevel(keg);

  return (
    <Fragment>
      <View style={styles.tabContainer}>
        <TabButton
          title="Details"
          isActive={activeTab === 'details'}
          onPress={() => setActiveTab('details')}
        />
        <TabButton
          title="Pours"
          isActive={activeTab === 'pours'}
          onPress={() => setActiveTab('pours')}
        />
      </View>
      <View style={styles.tabContent}>
        {activeTab === 'details' ? (
          <ScrollView style={styles.detailsScrollView}>
            <Section bottomPadded>
              <SectionContent>
                <BeverageDetailsLoader beverageID={beverage.id} />
              </SectionContent>
            </Section>
            <OverviewItem title="Keg Type" value={KEG_NAME_BY_KEG_TYPE[kegType]} />
            <OverviewItem
              title="Keg Level"
              value={`${kegLevel.toFixed(1)}%`}
            />
            <OverviewItem
              title="Ounces Poured"
              value={`${Math.round(ounces)} oz`}
            />
            <OverviewItem
              title="Tap Date"
              value={moment(tapDate).format('l')}
            />
            <OverviewItem
              title="Floated Date"
              value={
                floatedDate ? moment(floatedDate).format('l') : NULL_STRING_PLACEHOLDER
              }
            />
            {location && (
              <OverviewItem title="Location" value={location.name} />
            )}
          </ScrollView>
        ) : (
          <View style={styles.poursListContainer}>
            <KegPoursList kegId={keg.id} beverageId={keg.beverage?.id} onClose={onClose} />
          </View>
        )}
      </View>
    </Fragment>
  );
};

export default KegDetailsContent;
