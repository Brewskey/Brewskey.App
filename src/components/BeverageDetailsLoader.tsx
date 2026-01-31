import * as React from 'react';

import { BeverageDetailsContent } from 'components/BeverageDetailsContent';
import { useGetBeverageById } from 'hooks/queries/BeverageQueries';

import type { EntityID } from '@brewskey/js-api';

interface Props {
  beverageID: EntityID;
}

export const BeverageDetailsLoader: React.FC<Props> = ({ beverageID }) => {
  const beverage = useGetBeverageById(beverageID);

  if (beverage.data == null) {
    return null;
  }

  return <BeverageDetailsContent beverage={beverage.data} />;
};
