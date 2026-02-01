import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useRouter } from 'expo-router';
import moment from 'moment';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { KEG_NAME_BY_KEG_TYPE, NULL_STRING_PLACEHOLDER } from '@/constants';
import { UserAvatar } from 'common/avatars/UserAvatar';
import { Fragment } from 'common/Fragment';
import { List } from 'common/List';
import { ListEmpty } from 'common/ListEmpty';
import { ListItem } from 'common/ListItem';
import { LoadingListFooter } from 'common/LoadingListFooter';
import { OverviewItem } from 'common/OverviewItem';
import { Section } from 'common/Section';
import { SectionContent } from 'common/SectionContent';
import { BeverageDetailsLoader } from 'components/BeverageDetailsLoader';
import { PintCounter } from 'components/PintCounter';
import { useGetPours } from 'hooks/queries/PourQueries';
import { COLORS, TYPOGRAPHY } from 'theme';
import { calculateKegLevel } from 'utils';

import type { EntityID, Keg, Pour } from '@brewskey/js-api';
import type { ListRenderItemInfo } from 'react-native';

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

interface Props {
  keg: Keg;
  onClose?: () => void;
}

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
      item={pour}
      leftAvatar={<UserAvatar userName={pourOwnerUserName} />}
      onPress={pour.owner ? handlePress : undefined}
      rightIcon={<PintCounter beverageID={beverageId} ounces={pour.ounces} />}
      subtitle={moment(pour.pourDate).fromNow()}
      title={title}
    />
  );
};

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onPress }) => {
  const testID = `keg-details-tab-${title.toLowerCase()}`;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tab, isActive && styles.activeTab]}
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
    router.navigate({
      pathname: '/profile/[id]',
      params: { id: String(pour.owner.id) },
    });
  };

  const keyExtractor = (pour: Pour): string => pour.id.toString();

  const renderRow = ({
    item,
  }: ListRenderItemInfo<Pour>): React.ReactElement => (
    <PourRow beverageId={beverageId} onPress={handleItemPress} pour={item} />
  );

  return (
    <List
      data={pours.data}
      keyExtractor={keyExtractor}
      listType="flatList"
      onRefresh={() => {
        void pours.refetch();
      }}
      renderItem={renderRow}
      ListEmptyComponent={
        !pours.isLoading ? <ListEmpty message="No pours" /> : null
      }
      ListFooterComponent={
        <LoadingListFooter
          isLoading={pours.isFetchingNextPage || pours.isLoading}
        />
      }
      onEndReached={() => {
        if (pours.hasNextPage) {
          pours.fetchNextPage();
        }
      }}
    />
  );
};

const KegDetailsContent: React.FC<Props> = ({ keg, onClose }) => {
  const { beverage, kegType, ounces, tapDate, floatedDate, location } = keg;

  const [activeTab, setActiveTab] = React.useState<'details' | 'pours'>(
    'details',
  );

  const kegLevel = calculateKegLevel(keg);

  return (
    <Fragment>
      <View style={styles.tabContainer}>
        <TabButton
          isActive={activeTab === 'details'}
          onPress={() => setActiveTab('details')}
          title="Details"
        />
        <TabButton
          isActive={activeTab === 'pours'}
          onPress={() => setActiveTab('pours')}
          title="Pours"
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
            <OverviewItem
              title="Keg Type"
              value={KEG_NAME_BY_KEG_TYPE[kegType]}
            />
            <OverviewItem title="Keg Level" value={`${kegLevel.toFixed(1)}%`} />
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
                floatedDate
                  ? moment(floatedDate).format('l')
                  : NULL_STRING_PLACEHOLDER
              }
            />
            {location ? (
              <OverviewItem title="Location" value={location.name} />
            ) : null}
          </ScrollView>
        ) : (
          <View style={styles.poursListContainer}>
            <KegPoursList
              beverageId={keg.beverage?.id}
              kegId={keg.id}
              onClose={onClose}
            />
          </View>
        )}
      </View>
    </Fragment>
  );
};

export { KegDetailsContent };
