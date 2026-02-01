import * as React from 'react';

import { DESCRIPTION_BY_DEVICE_STATE } from '@/constants';
import { OverviewItem2 } from 'common/OverviewItem2';

import type { DeviceStatus } from '@brewskey/js-api';

interface Props {
  deviceState: DeviceStatus;
}

const DeviceStatusOverviewItem = ({
  deviceState,
}: Props): React.ReactElement => (
  <OverviewItem2
    description={DESCRIPTION_BY_DEVICE_STATE[deviceState]}
    title="State"
    value={deviceState}
  />
);

export { DeviceStatusOverviewItem };
