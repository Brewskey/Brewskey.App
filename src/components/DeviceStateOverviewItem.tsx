import * as React from 'react';

import OverviewItem from '../common/OverviewItem2';
import { DESCRIPTION_BY_DEVICE_STATE } from '../constants';

import type { DeviceStatus } from '@brewskey/js-api';

interface Props {
  deviceState: DeviceStatus;
}

const DeviceStatusOverviewItem = ({
  deviceState,
}: Props): React.ReactElement => (
  <OverviewItem
    description={DESCRIPTION_BY_DEVICE_STATE[deviceState]}
    title="State"
    value={deviceState}
  />
);

export default DeviceStatusOverviewItem;
