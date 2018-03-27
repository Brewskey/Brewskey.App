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
import Fragment from '../../common/Fragment';
import ListSubSectionSeparator from '../../common/ListSubSectionSeparator';
import { computed } from 'mobx';
import { withNavigation } from 'react-navigation';
import ListItem from '../../common/ListItem';
import NearbyLocationListEmpty from './NearbyLocationsListEmpty';
import LoadingListFooter from '../../common/LoadingListFooter';
import ListSectionHeader from '../../common/ListSectionHeader';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import { calculateKegLevel } from '../../utils';
import { COLORS } from '../../theme';

type InjectedProps = {|
  navigation: Navigation,
|};

type Props = {|
  isLoading: boolean,
  nearbyLocations: Array<NearbyLocation>,
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
  @computed
  get _sections(): Array<Section<NearbyTap>> {
    return this.props.nearbyLocations.map(
      ({ name, taps }: NearbyLocation): Section<NearbyTap> => ({
        data: taps
          .slice()
          .sort((a: NearbyTap, b: NearbyTap): number => a.deviceID - b.deviceID)
          .reduce((resultArr: Array<NearbyTap>, currentTap: NearbyTap): Array<
            NearbyTap,
          > => {
            const lastTap = resultArr[resultArr.length - 1];

            return [
              ...resultArr,
              {
                ...currentTap,
                tapIndex:
                  currentTap.deviceID === (lastTap && lastTap.deviceID)
                    ? lastTap.tapIndex + 1
                    : 1,
              },
            ];
          }, []),
        title: name,
      }),
    );
  }

  _keyExtractor = ({ id }: NearbyTap): string => id.toString();

  _onItemPress = ({ id }: NearbyTap) =>
    this.injectedProps.navigation.navigate('tapDetails', { id });

  _renderItem = ({
    index,
    item,
  }: {
    index: number,
    item: NearbyTap,
  }): React.Element<any> => {
    const { CurrentKeg: currentKeg, deviceName } = item;
    const kegLevel = currentKeg
      ? calculateKegLevel(currentKeg.ounces, currentKeg.maxOunces).toFixed(0)
      : null;

    const beverageName = currentKeg
      ? currentKeg.beverageName
      : 'No Beer on Tap';

    const showTopSeparator = index !== 0 && item.tapIndex === 1;

    return (
      <Fragment>
        {showTopSeparator && <ListSubSectionSeparator />}
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
          title={`${item.tapIndex} - ${beverageName}`}
          subtitle={deviceName}
        />
      </Fragment>
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
