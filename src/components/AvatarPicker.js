// @flow

import type AvatarStore from '../stores/AvatarStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import ImagePicker from 'react-native-image-picker';
import { Avatar } from 'react-native-elements';
import { inject, observer } from 'mobx-react';

const IMAGE_PICKER_OPTIONS = {
  title: 'SelectAvatar',
};

type InjectedProps = {|
  avatarStore: AvatarStore,
|};

@inject('avatarStore')
@observer
class AvatarPicker extends InjectedComponent<InjectedProps> {
  _onAvatarPress = () => {
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      ({ data, didCancel, error }: Object) => {
        if (didCancel || error) {
          return;
        }

        this.injectedProps.avatarStore.update(data);
      },
    );
  };

  render() {
    return (
      <Avatar
        onPress={this._onAvatarPress}
        rounded
        source={{ uri: this.injectedProps.avatarStore.sourceUri }}
        xlarge
      />
    );
  }
}

export default AvatarPicker;
