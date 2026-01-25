import type { Beverage, Keg, Permission, Tap } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY } from '../../../../../theme';
import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';
import KegsList from '../../../../../components/KegsList';
import Section from '../../../../../common/Section';
import SectionHeader from '../../../../../common/SectionHeader';
import SectionContent from '../../../../../common/SectionContent';
import Container from '../../../../../common/Container';
import Header from '../../../../../common/Header';
import LoadingIndicator from '../../../../../common/LoadingIndicator';
import NotFoundScreen from '../../../../../common/NotFoundScreen';
import Fragment from '../../../../../common/Fragment';
import { checkCanEdit } from '../../../../../permissionHelpers';
import { useGetKegById } from '../../../../../hooks/queries/KegQueries';
import { useGetTapById } from '../../../../../hooks/queries/TapQueries';
import { useGetPermissionForEntityById } from '../../../../../hooks/queries/PermissionQueries';
import { useGetFlowSensorByTapId } from '../../../../../hooks/queries/FlowSensorQueries';
import WarningNotification from '../../../../../common/WarningNotification';
import { KegLevelBar } from '../../../../../components/KegLevelBar';
import { BeverageDetailsLoader } from '../../../../../components/BeverageDetailsLoader';
import { TapDetailsNoKeg } from '../../../../../components/TapDetailsNoKeg';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    marginTop: 8,
    textAlign: 'center',
  },
});

const KegRoute: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const id = typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;
  const router = useRouter();
  
  if (!id) {
    return (
      <NotFoundScreen
        title="Tap Not Found"
        message="The tap you're looking for could not be found."
      />
    );
  }

  const { data: tap, isLoading } = useGetTapById(id as any);
  const { data: tapPermission } = useGetPermissionForEntityById('tap', id as any);
  const { data: flowSensor } = useGetFlowSensorByTapId(id as any);
  const { data: currentKeg, refetch } = useGetKegById(tap?.currentKeg.id);

  if (isLoading) {
    return (
      <Container>
        <Header shouldShowBackButton />
        <LoadingIndicator />
      </Container>
    );
  }

  if (!tap) {
    return (
      <NotFoundScreen
        title="Tap Not Found"
        message="The tap you're looking for could not be found."
      />
    );
  }

  const onWarningPress = () => {
    router.navigate({
      pathname: '/(tabs)/flow-sensor/new',
      params: {
        tapId: tap.id.toString(),
        shouldReturnOnFinish: 'true',
        showBackButton: 'true',
      },
    });
  };

  const noFlowSensorWarning: React.ReactNode =
    !flowSensor && checkCanEdit(tapPermission) ? (
      <WarningNotification
        message="You haven't setup flow sensor on the tap. Click to setup."
        onPress={onWarningPress}
      />
    ) : null;

  const _onRefresh = () => {
    refetch();
  };

  return (
    <KegsList
      ListHeaderComponent={
        <Fragment>
          {noFlowSensorWarning}
          {currentKeg ? (
            <Fragment>
              <Section bottomPadded>
                <SectionHeader title="Keg level" />
                <SectionContent paddedHorizontal>
                  <KegLevelBar kegID={tap.currentKeg.id} />
                  <Text style={styles.text}>
                    {Math.max(
                      0,
                      Math.round(currentKeg.maxOunces - currentKeg.ounces),
                    )}{' '}
                    oz. of {MAX_OUNCES_BY_KEG_TYPE[currentKeg.kegType]} oz.
                    remaining
                  </Text>
                </SectionContent>
              </Section>
              <Section bottomPadded>
                <SectionHeader title={currentKeg.beverage.name} testID="section-header-beverage" />
                <SectionContent>
                  <BeverageDetailsLoader beverageID={currentKeg.beverage.id} />
                </SectionContent>
              </Section>
            </Fragment>
          ) : (
            <Section bottomPadded>
              <TapDetailsNoKeg
                canEdit={checkCanEdit(tapPermission)}
                tapId={tap.id}
              />
            </Section>
          )}
          <SectionHeader title="Past Kegs" />
        </Fragment>
      }
      onRefresh={_onRefresh}
      queryOptions={{
        filters: [createFilter('tap/id').equals(tap.id)],
        orderBy: [{ column: 'id', direction: 'desc' }],
        skip: 1,
      }}
    />
  );
};

export default KegRoute;
