// @flow

import type { Beverage, AchievementType, EntityID } from 'brewskey.js-api';

import * as React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from 'react-native-elements';
import { observer } from 'mobx-react';
import nullthrows from 'nullthrows';
import { action, computed, observable, when } from 'mobx';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import { BeverageStore, PourStore } from '../../stores/DAOStores';
import LoaderComponent from '../../common/LoaderComponent';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import BeverageModal from '../modals/BeverageModal';
import { COLORS, TYPOGRAPHY } from '../../theme';

type Props = {|
  userID: EntityID,
|};

@observer
class AllBeveragesHScroll extends React.Component<Props> {
  refresh = () => BeverageStore.flushCache();

  @computed
  get _beverages(): LoadObject<Array<LoadObject<Beverage>>> {
    return BeverageStore.getMany({
      filters: [
        DAOApi.createFilter('Pours').any(
          `pour: pour/owner/id eq '${this.props.userID}'`,
        ),
        DAOApi.createFilter('Pours').any(`pour: pour/isDeleted eq false`),
      ],
    });
  }

  @computed
  get _beverageTotals(): LoadObject<Map<EntityID, number>> {
    return this._beverages
      .map((loaders) =>
        loaders.map((beverageLoader) =>
          beverageLoader.map((beverage) => beverage.id),
        ),
      )
      .map((items) => {
        if (items.some((loader) => loader.isLoading())) {
          return LoadObject.loading();
        }

        return PourStore.getPoursByBeverageIDs(
          items.map((loader) => loader.getValueEnforcing()),
          this.props.userID,
        );
      });
  }

  render(): React.Node {
    return (
      <LoaderComponent
        loadedComponent={AllBeveragesHScrollLoaded}
        loader={LoadObject.merge([this._beverages, this._beverageTotals])}
      />
    );
  }
}

export default AllBeveragesHScroll;

type LoadedProps = {|
  value: [Array<LoadObject<Beverage>>, LoadObject<Map<EntityID, number>>],
|};

@observer
class AllBeveragesHScrollLoaded extends React.Component<LoadedProps> {
  _modalRef = React.createRef<BeverageModal>();

  render(): React.Node {
    const [value, countsByID] = this.props.value;
    if (
      value == null ||
      value.length === 0 ||
      value.some((loader) => loader != null && loader.hasOperation()) ||
      countsByID == null
    ) {
      return <Empty />;
    }

    const beverages = value
      .map((loader) => loader.getValueEnforcing())
      .sort((a, b) => countsByID.get(b.id) - countsByID.get(a.id));

    return (
      <ScrollView horizontal style={{ paddingBottom: 16, marginLeft: 12 }}>
        {beverages.map((beverage: Beverage) => (
          <TouchableOpacity
            key={beverage.id}
            onPress={() =>
              nullthrows(this._modalRef.current).setBeverageID(beverage.id)
            }
          >
            <Card
              containerStyle={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 4,
                marginLeft: 0,
                width: 120,
              }}
            >
              <View
                style={{
                  alignSelf: 'center',
                  width: 70,
                }}
              >
                <BeverageAvatar beverageId={beverage.id} size={70} />
              </View>
              <View style={{ flex: 1, flexAlign: 'stretch' }}>
                <Text
                  numberOfLines={3}
                  style={{ flexGrow: 1, marginTop: 8, textAlign: 'center' }}
                >
                  {beverage.name}
                </Text>
                <Text
                  style={{
                    alignSelf: 'flex-end',
                    fontSize: 12,
                    marginTop: 12,
                  }}
                >
                  {countsByID.get(beverage.id).toFixed(0)} oz poured
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <BeverageModal ref={this._modalRef} />
      </ScrollView>
    );
  }
}

const Empty = () => {
  return null;
};
