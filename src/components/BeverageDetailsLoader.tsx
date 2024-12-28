import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';

import BeverageDetailsContent from './BeverageDetailsContent';
import { useGetBeverageById } from '../hooks/queries/BeverageQueries';

type Props = {
  beverageID: EntityID;
};

export const BeverageDetailsLoader: React.FC<Props> = ({ beverageID }) => {
  const beverage = useGetBeverageById(beverageID);

  if (beverage.data == null) {
    return null;
  }

  return <BeverageDetailsContent beverage={beverage.data} />;
};
