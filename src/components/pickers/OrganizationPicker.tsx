import type { QueryOptions, Organization } from '@brewskey/js-api';
import type { PickerValue, RenderRowProps } from './DAOPicker';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import SelectableListItem from '../../common/SelectableListItem';
import { useGetOrganizations } from '../../hooks/queries/OrganizationQueries';

type Props = {
  error?: string | null | undefined;
  onChange: (value?: Organization | null | undefined) => void;
  queryOptions?: QueryOptions;
  value: Organization | null | undefined;
};

const OrganizationPicker: React.FC<Props> = (props) => {
  const renderRow = ({
    item: organization,
    isSelected,
    toggleItem,
  }: RenderRowProps<Organization>): React.ReactElement => (
    <SelectableListItem
      chevron={false}
      isSelected={isSelected}
      item={organization}
      title={`${organization.id} - ${organization.name}`}
      onPress={() => toggleItem(organization)}
    />
  );

  return (
    <DAOPicker
      {...props}
      useQueryHook={useGetOrganizations}
      headerTitle="Select Organization"
      label="Organization"
      multiple={false}
      placeholder="None"
      queryOptions={props.queryOptions ?? {}}
      renderRow={renderRow}
      searchBy="name"
      shouldUseSearchQuery={false}
      stringValueExtractor={({ id, name }: Organization): string =>
        `${id} - ${name}`
      }
    />
  );
};

export default OrganizationPicker;
