import type { Location, QueryOptions } from '@brewskey/js-api';
import type { PickerValue, RenderRowProps } from './DAOPicker';
import type { TextStyle, ViewStyle, StyleProp } from 'react-native';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import SelectableListItem from '../../common/SelectableListItem';
import { NULL_STRING_PLACEHOLDER } from '../../constants';
import { useGetLocations } from '../../hooks/queries/LocationQueries';

type Props<TMultiple extends boolean> = {
  error?: string | null | undefined;
  inputStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  labelStyle?: TextStyle;
  multiple: TMultiple;
  onChange: (value: PickerValue<Location, TMultiple>) => void;
  placeholderTextColor?: string;
  queryOptions?: QueryOptions;
  selectionColor?: string;
  underlineColorAndroid?: string;
  validationTextStyle?: TextStyle;
  value: PickerValue<Location, TMultiple>;
};

function LocationPicker<TMultiple extends boolean>({
  multiple = false as TMultiple,
  ...props
}: Props<TMultiple>): React.ReactElement {
  const renderRow = ({
    item: location,
    isSelected,
    toggleItem,
  }: RenderRowProps<Location>): React.ReactElement => (
    <SelectableListItem
      chevron={false}
      isSelected={isSelected}
      item={location}
      subtitle={location.description || NULL_STRING_PLACEHOLDER}
      title={location.name}
      onPress={() => toggleItem(location)}
    />
  );

  const { inputStyle, ...restProps } = props;
  return (
    <DAOPicker
      {...restProps}
      inputStyle={inputStyle as StyleProp<ViewStyle>}
      useQueryHook={useGetLocations}
      headerTitle={`Select Location${multiple ? 's' : ''}`}
      label={`Location${multiple ? 's' : ''}`}
      multiple={multiple}
      queryOptions={props.queryOptions ?? {}}
      renderRow={renderRow}
      searchBy="name"
      shouldUseSearchQuery={false}
      stringValueExtractor={(location: Location): string => location.name}
    />
  );
}

export default LocationPicker;
