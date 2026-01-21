import type { EntityID, Tap } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

import Button from '../../common/buttons/Button';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import { useRouter } from 'expo-router';
import LoadingIndicator from '../../common/LoadingIndicator';
import CenteredModal from './CenteredModal';
import { COLORS } from '../../theme';
import ListItem from '../../common/ListItem';
import { usePourModalContext } from '../../hooks/context/PourProcessContext';
import { useGetTaps } from '../../hooks/queries/TapQueries';
import { createFilter } from '@brewskey/js-api/dist/filters';

const styles = StyleSheet.create({
  content: {
    alignItems: 'stretch',
    flexDirection: 'column',
    maxHeight: 400,
  },
  copy: {
    color: COLORS.textInverse,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    width: '100%',
  },
  headerText: {
    color: COLORS.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    height: 120,
  },
  scrollView: {
    flexGrow: 1,
    width: '100%',
  },
});

type TapPaymentProps = {
  tap: Tap;
};

const tapStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
  },
  subtitle: { color: COLORS.textFaded },
  title: { color: COLORS.text },
});

const TapPayment: React.FC<TapPaymentProps> = ({ tap }: TapPaymentProps) => {
  const pricePerOunce = 0;
  const { currentKeg, tapNumber } = tap;
  const { beverage } = currentKeg;
  return (
    <ListItem
      leftAvatar={<BeverageAvatar beverageId={beverage.id} />}
      containerStyle={tapStyles.container}
      chevron={false}
      title={`Tap ${tapNumber} - ${beverage.name}`}
      titleStyle={tapStyles.title}
      subtitle={`$${(pricePerOunce * 12).toFixed(
        2,
      )} for 12 ounces — $${pricePerOunce.toFixed(2)} per ounce`}
      subtitleStyle={tapStyles.subtitle}
    />
  );
};

const PourProcessPaymentModal: React.FC<Record<string, unknown>> = () => {
  const { setVisibility, shouldShowPaymentScreen } = usePourModalContext();
  const router = useRouter();
  const [deviceID] = React.useState<EntityID | null>(null);
  
  const queryOptions = React.useMemo(() => {
    if (!deviceID) return undefined;
    return {
      filters: [
        createFilter('device/id').equals(deviceID),
        createFilter('isPaymentEnabled').equals(true),
      ],
    };
  }, [deviceID]);

  const { data: tapsData, isLoading } = useGetTaps(queryOptions);
  const taps = tapsData?.pages.flat() ?? [];

  const hasCreditCardDetails = false; // TODO: Implement credit card details check
  const buttonText = hasCreditCardDetails ? 'Continue' : 'Add Payment Info';

  const handleContinuePress = React.useCallback(() => {
    if (hasCreditCardDetails) {
      // continue normal payment - this needs to be implemented
      // PourProcessStore.startPaymentPour();
    } else {
      setVisibility(false);
      router.navigate('/(tabs)/menu/payments');
    }
  }, [hasCreditCardDetails, setVisibility, router]);

  const isVisible = shouldShowPaymentScreen;
  const onHideModal = () => setVisibility(false);

  if (!deviceID) return null;

  return (
    <CenteredModal
      contentContainerStyle={{ padding: 0 }}
      header={<Text style={styles.headerText}>Brewskey Payments</Text>}
      isVisible={isVisible}
      onHideModal={onHideModal}
      width="90%"
    >
      {isLoading ? (
        <LoadingIndicator
          activitySize="large"
          color="white"
          style={styles.loadingIndicator}
        />
      ) : (
        <View style={styles.content}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.copy}>
              {taps.length > 1 ? 'These taps have' : 'This tap has'} payments
              enabled.
            </Text>
            {!hasCreditCardDetails ? null : (
              <Text style={styles.copy}>
                Click Continue to start pouring.
              </Text>
            )}
          </View>
          <ScrollView
            contentContainerStyle={{ padding: 8 }}
            style={styles.scrollView}
          >
            <View style={{ flex: 1 }}>
              {taps.map((tap) => (
                <TapPayment key={tap.id} tap={tap} />
              ))}
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Button
              containerStyle={{ marginLeft: 0, width: '100%' }}
              onPress={handleContinuePress}
              raised
              secondary
              title={buttonText}
            />
          </View>
        </View>
      )}
    </CenteredModal>
  );
};

export default PourProcessPaymentModal;
