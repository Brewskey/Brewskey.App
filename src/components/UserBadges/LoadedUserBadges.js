// @flow

import type { Badge } from '../../badges';

import * as React from 'react';
import { ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import BadgeIcon from '../BadgeIcon';
import BadgeModal from '../modals/BadgeModal';

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
      <ScrollView horizontal>
        {this.props.value.map((badge: Badge): React.Node => (
          <BadgeIcon
            badge={badge}
            key={badge.name}
            onPress={this._onBadgeIconPress}
          />
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
