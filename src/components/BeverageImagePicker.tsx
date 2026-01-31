import * as React from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Controller, useFormContext } from 'react-hook-form';

import { BeverageAvatar } from 'common/avatars/BeverageAvatar';

import type { EntityID } from '@brewskey/js-api';
import type { StyleProp, ViewStyle } from 'react-native';

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  allowsEditing: true,
  base64: true,
  aspect: [1, 1],
  quality: 1,
  mediaTypes: ['images'],
} as const;

interface Props {
  name: string;
  beverageId: EntityID | null | undefined;
  containerStyle?: StyleProp<ViewStyle>;
}

export const BeverageImagePicker: React.FC<Props> = ({
  beverageId,
  containerStyle,
  name,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const handleAvatarPress = async () => {
          // Request permissions
          const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permissionResult.granted) {
            return;
          }

          const result =
            await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);

          if (result.canceled || !result.assets?.[0]) {
            return;
          }

          onChange(result.assets[0].base64 || null);
        };

        return (
          <BeverageAvatar
            rounded
            beverageId={beverageId}
            cached={false}
            containerStyle={containerStyle}
            onPress={handleAvatarPress}
            size={250}
            uri={value ? `data:image/jpeg;base64,${value}` : null}
          />
        );
      }}
    />
  );
};
