// @flow

import type { Navigation, NearbyLocation, NearbyTap } from '../types';
import type NearbyLocationsStore from '../stores/NearbyLocationsStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import ListItem from '../common/ListItem';
import ListSectionHeader from '../common/ListSectionHeader';
import { SectionList } from 'react-native';
import BeverageAvatar from '../common/avatars/BeverageAvatar';

type Section<TType> = {
  data: Array<TType>,
  title: string,
};

type InjectedProps = {|
  nearbyLocationsStore: NearbyLocationsStore,
  navigation: Navigation,
|};

type State = {|
  isRefreshing: boolean,
|};

// todo add onItemPress
// add onPourIconPress
@withNavigation
@inject('nearbyLocationsStore')
@observer
class TapsList extends InjectedComponent<InjectedProps, {}, State> {
  state = {
    isRefreshing: false,
  };

  componentWillMount() {
    if (!this.injectedProps.nearbyLocationsStore.all.length) {
      this._onRefresh();
    }
  }

  get _sections(): Array<Section<NearbyTap>> {
    return this.injectedProps.nearbyLocationsStore.all.map(
      ({ name, taps }: NearbyLocation): Section<NearbyTap> => ({
        data: taps.slice(),
        title: name,
      }),
    );
  }

  _keyExtractor = ({ id }: NearbyLocation): string => id.toString();

  _onRefresh = async (): Promise<void> => {
    this.setState(() => ({ isRefreshing: true }));
    await this.injectedProps.nearbyLocationsStore.fetchAll();
    this.setState(() => ({ isRefreshing: false }));
  };

  _renderItem = ({ item }: { item: NearbyLocation }): React.Node => (
    <ListItem
      avatar={
        <BeverageAvatar
          beverageId={item.CurrentKeg ? item.CurrentKeg.beverageId : ''}
        />
      }
      item={item}
      rightIcon={{ name: 'md-beer', type: 'ionicon' }}
      subtitle={(item.CurrentKeg && item.CurrentKeg.beverageName) || '-'}
      title={item.name}
    />
  );

  _renderSectionHeader = ({ section }): React.Node => (
    <ListSectionHeader title={section.title} />
  );

  render() {
    return (
      <SectionList
        keyExtractor={this._keyExtractor}
        onRefresh={this._onRefresh}
        refreshing={this.state.isRefreshing}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        sections={this._sections}
      />
    );
  }
}

export default TapsList;
