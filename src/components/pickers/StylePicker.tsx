import type { Style, QueryOptions } from '@brewskey/js-api';
import type { PickerValue, RenderRowProps } from './DAOPicker';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import SelectableListItem from '../../common/SelectableListItem';
import { useGetStyles } from '../../hooks/queries/StyleQueries';

type Props = {
  error?: string | null | undefined;
  onChange: (value: PickerValue<Style, false>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Style, false>;
};

const StylePicker: React.FC<Props> = (props) => {
  const renderRow = ({
    item: style,
    isSelected,
    toggleItem,
  }: RenderRowProps<Style>): React.ReactElement => (
    <SelectableListItem
      chevron={false}
      isSelected={isSelected}
      item={style}
      title={style.name}
      onPress={() => toggleItem(style)}
    />
  );

  return (
    <DAOPicker
      {...props}
      useQueryHook={useGetStyles}
      headerTitle="Select Style"
      label="Style"
      multiple={false}
      queryOptions={props.queryOptions ?? {}}
      renderRow={renderRow}
      searchBy="name"
      shouldUseSearchQuery={false}
      stringValueExtractor={(style: Style): string => style.name}
    />
  );
};

export default StylePicker;
