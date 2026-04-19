import * as React from 'react';

import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Fragment } from 'common/Fragment';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { ScreenFallback } from 'common/ScreenFallback';
import { Section } from 'common/Section';
import { SectionContent } from 'common/SectionContent';
import { SectionHeader } from 'common/SectionHeader';
import { WarningNotification } from 'common/WarningNotification';
import { BeverageDetailsLoader } from 'components/BeverageDetailsLoader';
import { KegLevelBar } from 'components/KegLevelBar';
import { KegsList } from 'components/KegsList';
import { TapDetailsNoKeg } from 'components/TapDetailsNoKeg';
import { useGetFlowSensorByTapId } from 'hooks/queries/FlowSensorQueries';
import { useGetKegById } from 'hooks/queries/KegQueries';
import { useGetPermissionForEntityById } from 'hooks/queries/PermissionQueries';
import { useSuspenseGetTapById } from 'hooks/queries/TapQueries';
import { checkCanEdit } from 'permissionHelpers';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { EntityID } from '@brewskey/js-api';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    marginTop: 8,
    textAlign: 'center',
  },
});

const OnTapContent: React.FC<{ tapId: EntityID }> = ({ tapId }) => {
  const router = useRouter();
  const { data: tap, refetch } = useSuspenseGetTapById(tapId);
  const { data: tapPermission } = useGetPermissionForEntityById('tap', tapId);
  const { data: flowSensor } = useGetFlowSensorByTapId(tapId);
  const kegId = tap.currentKeg?.id ?? null;
  const { data: currentKeg } = useGetKegById(kegId);

  const onWarningPress = () => {
    router.navigate({
      pathname: '/flow-sensor/new',
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

  return (
    <KegsList
      onRefresh={() => {
        void refetch();
      }}
      ListHeaderComponent={
        <Fragment>
          {noFlowSensorWarning}
          {currentKeg ? (
            <Fragment>
              <Section bottomPadded>
                <SectionHeader
                  testID="section-header-keg-level"
                  title="Keg level"
                />
                <SectionContent paddedHorizontal>
                  <KegLevelBar kegID={tap.currentKeg!.id} />
                  <Text style={styles.text} testID="keg-level-text">
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
                <SectionHeader
                  testID="section-header-beverage"
                  title={currentKeg.beverage?.name ?? 'Beverage'}
                />
                <SectionContent>
                  {currentKeg.beverage?.id != null ? (
                    <BeverageDetailsLoader
                      beverageID={currentKeg.beverage.id}
                    />
                  ) : null}
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
      queryOptions={{
        filters: [createFilter('tap/id').equals(tap.id)],
        orderBy: [{ column: 'id', direction: 'desc' }],
        skip: 1,
      }}
    />
  );
};

const OnTapRoute: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const id =
    typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

  if (!id) {
    return (
      <NotFoundScreen
        message="The tap you're looking for could not be found."
        title="Tap Not Found"
      />
    );
  }

  const tapIdAsEntity = id as EntityID;

  return (
    <React.Suspense
      fallback={
        <ScreenFallback
          shouldShowBackButton
          testID="on-tap"
          title={undefined}
        />
      }
    >
      <OnTapContent tapId={tapIdAsEntity} />
    </React.Suspense>
  );
};

export default OnTapRoute;
