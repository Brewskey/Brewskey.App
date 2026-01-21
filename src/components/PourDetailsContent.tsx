import type { Pour } from '@brewskey/js-api';

import * as React from 'react';
import moment from 'moment';
import { useRouter } from 'expo-router';
import OverviewItem from '../common/OverviewItem';
import Fragment from '../common/Fragment';
import { NULL_STRING_PLACEHOLDER } from '../constants';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import UserAvatar from '../common/avatars/UserAvatar';
import PintCounter from './PintCounter';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

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

type Props = {
  pour: Pour;
  onNavigateToProfile?: (userId: string | number) => void;
  onNavigateToBeverage?: (beverageId: string | number) => void;
  onNavigateToLocation?: (locationId: string | number) => void;
  onNavigateToDevice?: (deviceId: string | number) => void;
  onClose?: () => void;
};

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
      router.navigate(`/(tabs)/profile/${pour.owner.id}`);
    }
  };

  const handleBeveragePress = () => {
    if (pour.beverage?.id) {
      onClose?.();
      onNavigateToBeverage?.(pour.beverage.id);
      router.navigate(`/(tabs)/beverages/${pour.beverage.id}`);
    }
  };

  const handleLocationPress = () => {
    if (pour.location?.id) {
      onClose?.();
      onNavigateToLocation?.(pour.location.id);
      router.navigate(`/(tabs)/locations/${pour.location.id}`);
    }
  };

  const handleDevicePress = () => {
    if (pour.device?.id) {
      onClose?.();
      onNavigateToDevice?.(pour.device.id);
      router.navigate(`/(tabs)/devices/${pour.device.id}`);
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
        {pour.beverage?.id && (
          <BeverageAvatar beverageId={pour.beverage.id} size={80} />
        )}
      </View>
      <OverviewItem
        title="Beverage"
        value={
          pour.beverage?.id ? (
            <TouchableOpacity
              style={styles.touchableRow}
              onPress={handleBeveragePress}
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
            {pour.beverage?.id && (
              <View style={{ marginLeft: 8 }}>
                <PintCounter
                  beverageID={pour.beverage.id}
                  ounces={pour.ounces}
                />
              </View>
            )}
          </View>
        }
      />
      {pour.pulses != null && (
        <OverviewItem title="Pulses" value={pour.pulses.toString()} />
      )}
      <OverviewItem title="Date" value={pourDate} />
      <OverviewItem title="Time" value={pourDateRelative} />
      {pour.owner && (
        <OverviewItem
          title="Owner"
          value={
            <TouchableOpacity
              style={styles.touchableRow}
              onPress={handleProfilePress}
            >
              <UserAvatar userName={pour.owner.userName} size={24} />
              <Text style={[styles.ownerName, { marginLeft: 8 }]}>
                {ownerName}
              </Text>
            </TouchableOpacity>
          }
        />
      )}
      {pour.location && (
        <OverviewItem
          title="Location"
          value={
            <TouchableOpacity
              style={styles.touchableRow}
              onPress={handleLocationPress}
            >
              <Text style={styles.locationName}>{locationName}</Text>
            </TouchableOpacity>
          }
        />
      )}
      {pour.device && (
        <OverviewItem title="Box" value={<TouchableOpacity
          style={styles.touchableRow}
          onPress={handleDevicePress}
        >
          <Text style={styles.locationName}>{pour.device.name}</Text>
        </TouchableOpacity>} />
      )}
    </Fragment>
  );
};

export default PourDetailsContent;
