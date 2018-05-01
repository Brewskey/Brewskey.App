// @flow

import type { EntityID } from 'brewskey.js-api';
import type { Style } from '../types';

import * as React from 'react';
import * as ImagePicker from 'react-native-image-picker';
import { observer } from 'mobx-react/native';
import BeverageAvatar from '../common/avatars/BeverageAvatar';

const IMAGE_PICKER_OPTIONS = {
  title: 'Select beverage sticker',
};

type Props = {
  beverageId: ?EntityID,
  containerStyle?: Style,
  onChange: (imageData: ?string) => void,
  value: ?string,
};

@observer
class BeverageImagePickerField extends React.Component<Props> {
  _onAvatarPress = () => {
    const { onChange } = this.props;
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      ({ data, didCancel, error }: Object): void => {
        if (didCancel || error) {
          return;
        }

        onChange(data);
      },
    );
  };

  render() {
    const { beverageId, containerStyle, value } = this.props;

    return (
      <BeverageAvatar
        beverageId={beverageId}
        cached={false}
        containerStyle={containerStyle}
        onPress={this._onAvatarPress}
        size={250}
        uri={value ? `data:image/jpeg;base64,${value}` : null}
      />
    );
  }
}

export default BeverageImagePickerField;
