// @flow

import type {
  Navigation,
  NearbyLocation,
  NearbyTap,
  Section,
} from '../../types';

import * as React from 'react';
import { SectionList } from 'react-native';
import InjectedComponent from '../../common/InjectedComponent';
import { observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import ListItem from '../../common/ListItem';
import NearbyLocationListEmpty from './NearbyLocationsListEmtpy';
import LoadingListFooter from '../../common/LoadingListFooter';
import ListSectionHeader from '../../common/ListSectionHeader';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import { calculateKegLevel } from '../../utils';
import { COLORS } from '../../theme';

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

  _keyExtractor = ({ id }: NearbyTap): string => id.toString();

  _onItemPress = ({ id }: NearbyTap) =>
    this.injectedProps.navigation.navigate('tapDetails', { id });

  _renderItem = ({ index, item }: { item: NearbyTap }): React.Element<any> => {
    const { CurrentKeg: currentKeg } = item;
    const kegLevel = currentKeg
      ? calculateKegLevel(currentKeg.ounces, currentKeg.maxOunces).toFixed(0)
      : null;

    const beverageName = currentKeg
      ? currentKeg.beverageName
      : 'No Beer on Tap';

    return (
      <ListItem
        avatar={
          <BeverageAvatar
            beverageId={currentKeg ? currentKeg.beverageId : ''}
          />
        }
        badge={
          kegLevel !== null
            ? {
                containerStyle: { backgroundColor: COLORS.accent },
                value: `${kegLevel}%`,
              }
            : null
        }
        hideChevron
        item={item}
        onPress={this._onItemPress}
        title={`${index + 1} - ${beverageName}`}
      />
    );
  };

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
        ListEmptyComponent={
          !this.props.isLoading ? <NearbyLocationListEmpty /> : null
        }
        ListFooterComponent={
          <LoadingListFooter isLoading={this.props.isLoading} />
        }
      />
    );
  }
}

export default NearbyLocationList;
