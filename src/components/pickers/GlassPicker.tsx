import type { Glass, QueryOptions } from '@brewskey/js-api';
import type { PickerValue, RenderRowProps } from './DAOPicker';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import SelectableListItem from '../../common/SelectableListItem';
import { useGetGlasses } from '../../hooks/queries/GlassQueries';

type Props = {
  error?: string | null | undefined;
  onChange: (value: PickerValue<Glass, false>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Glass, false>;
};

const GlassPicker: React.FC<Props> = (props) => {
  const renderRow = ({
    item: glass,
    isSelected,
    toggleItem,
  }: RenderRowProps<Glass>): React.ReactElement => (
    <SelectableListItem
      chevron={false}
      isSelected={isSelected}
      item={glass}
      title={glass.name}
      onPress={() => toggleItem(glass)}
    />
  );

  return (
    <DAOPicker
      {...props}
      useQueryHook={useGetGlasses}
      headerTitle="Select Glass"
      label="Glass"
      multiple={false}
      queryOptions={props.queryOptions ?? {}}
      renderRow={renderRow}
      searchBy="name"
      shouldUseSearchQuery={false}
      stringValueExtractor={(glass: Glass): string => glass.name}
    />
  );
};

export default GlassPicker;
