// @flow

import type { Beverage, EntityID, Keg } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { BeverageStore, KegStore } from '../stores/DAOStores';
import { ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Container from '../common/Container';
import LoaderBeverageDetails from '../components/BeverageDetailsLoader';
import KegList from '../components/KegList';
import SectionHeader from '../common/SectionHeader';

type InjectedProps = {|
  tapId: EntityID,
  navigation: Navigation,
|};

// todo loading on tap BeverageDetails
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
      <Container>
        <ScrollView>
          <LoaderBeverageDetails loader={this._currentBeverageLoader} />
          <SectionHeader title="Past Kegs" />
          <KegList
            queryOptions={{
              filters: [DAOApi.createFilter('tap/id').equals(tapId)],
              orderBy: [{ column: 'id', direction: 'desc' }],
              skip: 1,
            }}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default TapDetailsKegScreen;
