import type { Beverage, Keg, Permission, Tap } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';
import KegsList from '../components/KegsList';
import Section from '../common/Section';
import Fragment from '../common/Fragment';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';
import { checkCanEdit } from '../permissionHelpers';
import { useGetKegById } from '../hooks/queries/KegQueries';
import { KegLevelBar } from '../components/KegLevelBar';
import { BeverageDetailsLoader } from '../components/BeverageDetailsLoader';
import { TapDetailsNoKeg } from '../components/TapDetailsNoKeg';

type Props = {
  noFlowSensorWarning: React.ReactNode;
  tap: Tap;
  tapPermission: Permission | undefined;
};

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    marginTop: 8,
    textAlign: 'center',
  },
});

export const TapDetailsKegScreen: React.FC<Props> = ({
  tap,
  noFlowSensorWarning,
  tapPermission,
}) => {
  const { data: currentKeg, refetch } = useGetKegById(tap.currentKeg.id);

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
                <SectionHeader title={currentKeg.beverage.name} />
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

export default TapDetailsKegScreen;
