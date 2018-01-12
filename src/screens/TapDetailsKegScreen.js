// @flow

import type { Beverage, EntityID, Keg } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { BeverageStore, KegStore } from '../stores/DAOStores';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import LoaderBeverageDetails from '../components/BeverageDetailsLoader';
import KegsList from '../components/KegsList';
import SectionHeader from '../common/SectionHeader';

type InjectedProps = {|
  navigation: Navigation,
  tapId: EntityID,
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
    return (
      KegStore.getMany({
        filters: [DAOApi.createFilter('tap/id').equals(tapId)],
        limit: 1,
      })
        .map(
          (loaders: Array<LoadObject<Keg>>): LoadObject<Keg> =>
            loaders[0] || LoadObject.empty(),
        )
        // todo the type is Keg | LoadObject<Keg>, but in
        // practise it's Keg;
        .map((currentKeg: $FlowFixMe): LoadObject<Beverage> =>
          BeverageStore.getByID(currentKeg.beverage.id),
        )
    );
  }

  render() {
    const { tapId } = this.injectedProps;
    return (
      <KegsList
        ListHeaderComponent={
          <View>
            <LoaderBeverageDetails loader={this._currentBeverageLoader} />
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
