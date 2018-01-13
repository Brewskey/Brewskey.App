// @flow

import type { Badge } from '../../badges';

import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import BadgeIcon from '../BadgeIcon';
import BadgeModal from '../modals/BadgeModal';

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 5,
  },
  container: {
    paddingVertical: 10,
  },
});

type Props = {|
  value: Array<Badge>,
|};

@observer
class LoadedUserBadges extends React.Component<Props> {
  @observable _isModalVisible: boolean = false;
  @observable _selectedBadge: ?Badge = null;

  @action
  _selectBadge = (badge: ?Badge) => {
    this._selectedBadge = badge;
  };

  @action
  _showModal = () => {
    this._isModalVisible = true;
  };

  @action
  _hideModal = () => {
    this._selectBadge(null);
    this._isModalVisible = false;
  };

  _onBadgeIconPress = (badge: Badge) => {
    this._selectBadge(badge);
    this._showModal();
  };

  render() {
    return (
      <ScrollView style={styles.container} horizontal>
        {this.props.value.map((badge: Badge): React.Node => (
          <View key={badge.name} style={styles.badgeContainer}>
            <BadgeIcon badge={badge} onPress={this._onBadgeIconPress} />
          </View>
        ))}
        <BadgeModal
          badge={this._selectedBadge}
          isVisible={this._isModalVisible}
          onHideModal={this._hideModal}
        />
      </ScrollView>
    );
  }
}

export default LoadedUserBadges;
