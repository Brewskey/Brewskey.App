// @flow

import type { Beverage, EntityID } from 'brewskey.js-api';

import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { BeverageStore } from '../../stores/DAOStores';
import Modal from './Modal';
import Section from '../../common/Section';
import SectionContent from '../../common/SectionContent';
import SectionHeader from '../../common/SectionHeader';
import BeverageDetailsContent from '../../components/BeverageDetailsContent';
import Button from '../../common/buttons/Button';
import IconButton from '../../common/buttons/IconButton';
import { COLORS } from '../../theme';

type ModalProps = {||};

@observer
class BeverageModal extends React.Component<ModalProps> {
  @observable
  _beverageID: ?EntityID;

  @computed
  get _beverage(): ?Beverage {
    if (this._beverageID == null) {
      return null;
    }

    return BeverageStore.getByID(this._beverageID).getValue();
  }

  @action
  setBeverageID = (id: ?EntityID) => {
    this._beverageID = id;
  };

  @action
  onHideModal = () => {
    this._beverageID = null;
  };

  render(): React.Node {
    const beverage = this._beverage;
    if (beverage == null) {
      return null;
    }

    return (
      <Modal
        isVisible={beverage != null}
        onHideModal={this.onHideModal}
        transparent={false}
      >
        <ScrollView horizontal={false} style={{ marginVertical: 12 }}>
          <Section>
            <View
              style={{ position: 'absolute', top: 12, right: 0, zIndex: 100 }}
            >
              <IconButton
                color={COLORS.text}
                name="close"
                onPress={this.onHideModal}
              />
            </View>
            <SectionHeader title={beverage.name} />
            <SectionContent>
              <BeverageDetailsContent beverage={beverage} />
            </SectionContent>
            <Button
              title="Close"
              onPress={this.onHideModal}
              style={{ marginVertical: 12 }}
            />
          </Section>
        </ScrollView>
      </Modal>
    );
  }
}

export default BeverageModal;
