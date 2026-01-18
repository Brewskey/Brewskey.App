import type { Srm, QueryOptions } from '@brewskey/js-api';
import type { PickerValue, RenderRowProps } from './DAOPicker';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import SelectableListItem from '../../common/SelectableListItem';
import { useGetSrms } from '../../hooks/queries/SrmQueries';

type Props = {
  error?: string | null | undefined;
  onChange: (value: PickerValue<Srm, false>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Srm, false>;
};

const SrmPicker: React.FC<Props> = (props) => {
  const renderRow = ({
    item: srm,
    isSelected,
    toggleItem,
  }: RenderRowProps<Srm>): React.ReactElement => (
    <SelectableListItem
      chevron={false}
      isSelected={isSelected}
      item={srm}
      title={srm.name}
      onPress={() => toggleItem(srm)}
    />
  );

  return (
    <DAOPicker
      {...props}
      useQueryHook={useGetSrms}
      headerTitle="Select SRM"
      label="SRM"
      multiple={false}
      queryOptions={props.queryOptions ?? {}}
      renderRow={renderRow}
      searchBy="name"
      shouldUseSearchQuery={false}
      stringValueExtractor={(srm: Srm): string => srm.name}
    />
  );
};

export default SrmPicker;
