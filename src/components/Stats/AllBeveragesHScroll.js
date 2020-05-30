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
import { BeverageStore } from '../../stores/DAOStores';
import LoaderComponent from '../../common/LoaderComponent';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import Modal from '../modals/Modal';
import Button from '../../common/buttons/Button';
import ToggleStore from '../../stores/ToggleStore';
import BeverageDetailsContent from '../BeverageDetailsContent';
import Section from '../../common/Section';
import SectionContent from '../../common/SectionContent';
import SectionHeader from '../../common/SectionHeader';

type Props = {|
  userID: EntityID,
|};

@observer
class AllBeveragesHScroll extends React.Component<Props> {
  @computed
  get _beverages(): LoadObject<Array<LoadObject<Beverage>>> {
    return BeverageStore.getMany({
      filters: [
        DAOApi.createFilter('Pours').any(
          `pour: pour/owner/id eq '${this.props.userID}'`,
        ),
      ],
    });
  }

  render(): React.Node {
    return (
      <LoaderComponent
        loadedComponent={AllBeveragesHScrollLoaded}
        loader={this._beverages}
      />
    );
  }
}

export default AllBeveragesHScroll;

type LoadedProps = {|
  value: Array<LoadObject<Beverage>>,
|};

@observer
class AllBeveragesHScrollLoaded extends React.Component<LoadedProps> {
  @observable
  _beverage: ?Beverage;

  _modalToggleStore = new ToggleStore();

  @action
  _onShowModal = (beverage) => {
    this._beverage = beverage;
    this._modalToggleStore.toggleOn();
  };

  @action
  _onHideModal = () => {
    this._beverage = null;
    this._modalToggleStore.toggleOn();
  };

  render(): React.Node {
    const { value } = this.props;
    if (value.length === 0 || value.some((loader) => loader.hasOperation())) {
      return <Empty />;
    }
    const beverages = value.map((loader) => loader.getValueEnforcing());

    return (
      <ScrollView horizontal style={{ paddingBottom: 16, marginLeft: 12 }}>
        {beverages.map((beverage: Beverage) => (
          <TouchableOpacity
            key={beverage.id}
            onPress={() => this._onShowModal(beverage)}
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
              <Text
                numberOfLines={3}
                style={{ marginTop: 8, textAlign: 'center' }}
              >
                {beverage.name}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
        <BeverageModal
          beverage={this._beverage}
          isVisible={this._modalToggleStore.isToggled}
          onHideModal={this._onHideModal}
        />
      </ScrollView>
    );
  }
}

type ModalProps = {|
  beverage: ?Beverage,
  isVisible: boolean,
  onHideModal: () => void,
|};
const BeverageModal = ({
  beverage,
  isVisible,
  onHideModal,
}: ModalProps): React.Node => {
  if (beverage == null) {
    return null;
  }

  return (
    <Modal isVisible={isVisible} onHideModal={onHideModal} transparent={false}>
      <ScrollView horizontal={false} style={{ marginVertical: 12 }}>
        <Section>
          <SectionHeader title={beverage.name} />
          <SectionContent>
            <BeverageDetailsContent beverage={beverage} />
          </SectionContent>
          <Button
            title="Back"
            onPress={onHideModal}
            style={{ marginVertical: 12 }}
          />
        </Section>
      </ScrollView>
    </Modal>
  );
};

const Empty = () => {
  return null;
};
