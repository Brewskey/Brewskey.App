// @flow

import type { Beverage, EntityID, Tap } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { BeverageStore, TapStore } from '../stores/DAOStores';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import LoaderBeverageDetails from '../components/BeverageDetailsLoader';
import KegsList from '../components/KegsList';
import SectionHeader from '../common/SectionHeader';

type InjectedProps = {|
  navigation: Navigation,
  tapId: EntityID,
  noFlowSensorWarning: ?React.Element<any>,
|};

@flatNavigationParamsAndScreenProps
@observer
class TapDetailsKegScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'On Tap',
  };

  @computed
  get _currentBeverageLoader(): LoadObject<Beverage> {
    const { tapId } = this.injectedProps;
    return TapStore.getByID(tapId).map(
      ({ currentKeg }: Tap): LoadObject<Beverage> =>
        currentKeg
          ? BeverageStore.getByID(currentKeg.beverage.id)
          : LoadObject.empty(),
    );
  }

  render() {
    const { noFlowSensorWarning, tapId } = this.injectedProps;
    return (
      <KegsList
        ListHeaderComponent={
          <View>
            {noFlowSensorWarning}
            <LoaderBeverageDetails
              loader={this._currentBeverageLoader}
              tapId={tapId}
            />
            <SectionHeader title="Past Kegs" />
          </View>
        }
        queryOptions={{
          filters: [DAOApi.createFilter('tap/id').equals(tapId)],
          orderBy: [{ column: 'id', direction: 'desc' }],
          skip: 1,
        }}
      />
    );
  }
}

export default TapDetailsKegScreen;
