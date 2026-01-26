import * as React from 'react';

import { useRouter } from 'expo-router';
import moment from 'moment';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PintCounter from './PintCounter';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import UserAvatar from '../common/avatars/UserAvatar';
import Fragment from '../common/Fragment';
import OverviewItem from '../common/OverviewItem';
import { NULL_STRING_PLACEHOLDER } from '../constants';
import { COLORS, TYPOGRAPHY } from '../theme';

import type { Pour } from '@brewskey/js-api';

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  touchableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  beverageName: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.accent,
  },
  ownerName: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.accent,
  },
  locationName: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.accent,
  },
});

interface Props {
  pour: Pour;
  onNavigateToProfile?: (userId: string | number) => void;
  onNavigateToBeverage?: (beverageId: string | number) => void;
  onNavigateToLocation?: (locationId: string | number) => void;
  onNavigateToDevice?: (deviceId: string | number) => void;
  onClose?: () => void;
}

const PourDetailsContent: React.FC<Props> = ({
  pour,
  onNavigateToProfile,
  onNavigateToBeverage,
  onNavigateToLocation,
  onNavigateToDevice,
  onClose,
}) => {
  const router = useRouter();

  const handleProfilePress = () => {
    if (pour.owner?.id) {
      onClose?.();
      onNavigateToProfile?.(pour.owner.id);
      router.navigate({
        pathname: '/(tabs)/profile/[id]',
        params: { id: String(pour.owner.id) },
      });
    }
  };

  const handleBeveragePress = () => {
    if (pour.beverage?.id) {
      onClose?.();
      onNavigateToBeverage?.(pour.beverage.id);
      router.navigate({
        pathname: '/(tabs)/beverages/[id]',
        params: { id: String(pour.beverage.id) },
      });
    }
  };

  const handleLocationPress = () => {
    if (pour.location?.id) {
      onClose?.();
      onNavigateToLocation?.(pour.location.id);
      router.navigate({
        pathname: '/(tabs)/locations/[id]',
        params: { id: String(pour.location.id) },
      });
    }
  };

  const handleDevicePress = () => {
    if (pour.device?.id) {
      onClose?.();
      onNavigateToDevice?.(pour.device.id);
      router.navigate({
        pathname: '/(tabs)/devices/[id]',
        params: { id: String(pour.device.id) },
      });
    }
  };

  const beverageName = pour.beverage?.name || NULL_STRING_PLACEHOLDER;
  const ownerName = pour.owner?.userName || NULL_STRING_PLACEHOLDER;
  const locationName = pour.location?.name || NULL_STRING_PLACEHOLDER;
  const pourDate = moment(pour.pourDate).format('lll');
  const pourDateRelative = moment(pour.pourDate).fromNow();

  return (
    <Fragment>
      <View style={styles.avatarContainer}>
        {pour.beverage?.id ? (
          <BeverageAvatar beverageId={pour.beverage.id} size={80} />
        ) : null}
      </View>
      <OverviewItem
        title="Beverage"
        value={
          pour.beverage?.id ? (
            <TouchableOpacity
              onPress={handleBeveragePress}
              style={styles.touchableRow}
            >
              <BeverageAvatar beverageId={pour.beverage.id} size={24} />
              <Text style={[styles.beverageName, { marginLeft: 8 }]}>
                {beverageName}
              </Text>
            </TouchableOpacity>
          ) : (
            NULL_STRING_PLACEHOLDER
          )
        }
      />
      <OverviewItem
        title="Amount"
        value={
          <View style={styles.touchableRow}>
            <Text>{`${pour.ounces.toFixed(1)} oz`}</Text>
            {pour.beverage?.id ? (
              <View style={{ marginLeft: 8 }}>
                <PintCounter
                  beverageID={pour.beverage.id}
                  ounces={pour.ounces}
                />
              </View>
            ) : null}
          </View>
        }
      />
      {pour.pulses != null && (
        <OverviewItem title="Pulses" value={pour.pulses.toString()} />
      )}
      <OverviewItem title="Date" value={pourDate} />
      <OverviewItem title="Time" value={pourDateRelative} />
      {pour.owner ? (
        <OverviewItem
          title="Owner"
          value={
            <TouchableOpacity
              onPress={handleProfilePress}
              style={styles.touchableRow}
            >
              <UserAvatar size={24} userName={pour.owner.userName} />
              <Text style={[styles.ownerName, { marginLeft: 8 }]}>
                {ownerName}
              </Text>
            </TouchableOpacity>
          }
        />
      ) : null}
      {pour.location ? (
        <OverviewItem
          title="Location"
          value={
            <TouchableOpacity
              onPress={handleLocationPress}
              style={styles.touchableRow}
            >
              <Text style={styles.locationName}>{locationName}</Text>
            </TouchableOpacity>
          }
        />
      ) : null}
      {pour.device ? (
        <OverviewItem
          title="Box"
          value={
            <TouchableOpacity
              onPress={handleDevicePress}
              style={styles.touchableRow}
            >
              <Text style={styles.locationName}>{pour.device.name}</Text>
            </TouchableOpacity>
          }
        />
      ) : null}
    </Fragment>
  );
};

export default PourDetailsContent;
