// @flow

import type {
  Navigation,
  NearbyLocation,
  NearbyTap,
  Section,
} from '../../types';

import * as React from 'react';
import InjectedComponent from '../../common/InjectedComponent';
import { observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import ListItem from '../../common/ListItem';
import NearbyLocationListEmpty from './NearbyLocationsListEmtpy';
import LoadingListFooter from '../../common/LoadingListFooter';
import ListSectionHeader from '../../common/ListSectionHeader';
import { SectionList } from 'react-native';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';

type InjectedProps = {|
  navigation: Navigation,
|};

type Props = {|
  nearbyLocations: Array<NearbyLocation>,
  isLoading: boolean,
|};

type State = {|
  isRefreshing: boolean,
|};

// todo pull to refresh for update gps position?
// todo add onItemPress
// add onPourIconPress
@withNavigation
@observer
class NearbyLocationList extends InjectedComponent<
  InjectedProps,
  Props,
  State,
> {
  get _sections(): Array<Section<NearbyTap>> {
    return this.props.nearbyLocations.map(
      ({ name, taps }: NearbyLocation): Section<NearbyTap> => ({
        data: taps.slice(),
        title: name,
      }),
    );
  }

  _keyExtractor = ({ id }: NearbyLocation): string => id.toString();

  _renderItem = ({ item }: { item: NearbyLocation }): React.Element<any> => (
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

  _renderSectionHeader = ({ section }): React.Element<any> => (
    <ListSectionHeader title={section.title} />
  );

  render() {
    return (
      <SectionList
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        sections={this._sections}
        ListEmptyComponent={<NearbyLocationListEmpty />}
        ListFooterComponent={
          <LoadingListFooter isLoading={this.props.isLoading} />
        }
      />
    );
  }
}

export default NearbyLocationList;
