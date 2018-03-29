// @flow

import type { Beverage, Tap } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { BeverageStore, TapStore } from '../stores/DAOStores';
import { observer } from 'mobx-react/native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import BeverageDetailsLoader from '../components/BeverageDetailsLoader';
import KegLevelBar from '../components/KegLevelBar';
import TapDetailsNoKeg from '../components/TapDetailsNoKeg';
import KegsList from '../components/KegsList';
import Section from '../common/Section';
import Fragment from '../common/Fragment';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';

type InjectedProps = {|
  navigation: Navigation,
  noFlowSensorWarning: ?React.Element<any>,
  tap: Tap,
|};

@flatNavigationParamsAndScreenProps
@observer
class TapDetailsKegScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'On Tap',
  };

  @computed
  get _currentBeverageLoader(): LoadObject<Beverage> {
    const { tap: { id } } = this.injectedProps;
    return TapStore.getByID(id).map(
      ({ currentKeg }: Tap): LoadObject<Beverage> =>
        currentKeg
          ? BeverageStore.getByID(currentKeg.beverage.id)
          : LoadObject.empty(),
    );
  }

  render() {
    const { noFlowSensorWarning, tap: { currentKeg, id } } = this.injectedProps;

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
                    <KegLevelBar
                      maxOunces={currentKeg.maxOunces}
                      ounces={currentKeg.ounces}
                    />
                  </SectionContent>
                </Section>
                <Section bottomPadded>
                  <SectionHeader
                    title={`Beverage: ${currentKeg.beverage.name}`}
                  />
                  <SectionContent>
                    <BeverageDetailsLoader
                      beverageID={currentKeg.beverage.id}
                    />
                  </SectionContent>
                </Section>
              </Fragment>
            ) : (
              <Section bottomPadded>
                <TapDetailsNoKeg tapId={id} />
              </Section>
            )}
            <SectionHeader title="Past Kegs" />
          </Fragment>
        }
        queryOptions={{
          filters: [DAOApi.createFilter('tap/id').equals(id)],
          orderBy: [{ column: 'id', direction: 'desc' }],
          skip: 1,
        }}
      />
    );
  }
}

export default TapDetailsKegScreen;
