// @flow

import type { DeviceStatus } from 'brewskey.js-api';

import * as React from 'react';
import OverviewItem from '../common/OverviewItem2';
import { DESCRIPTION_BY_DEVICE_STATE } from '../constants';

type Props = {|
  deviceState: DeviceStatus,
|};

const DeviceStatusOverviewItem = ({ deviceState }: Props): React.Node => (
  <OverviewItem
    title="State"
    value={deviceState}
    description={DESCRIPTION_BY_DEVICE_STATE[deviceState]}
  />
);

export default DeviceStatusOverviewItem;
