// @flow

import type { DeviceStatus } from 'brewskey.js-api';

import * as React from 'react';
import OverviewItem from '../common/OverviewItem2';

const DESCRIPTION_BY_DEVICE_STATE: { [key: DeviceStatus]: string } = {
  Active: 'Your device is currently active and can pour beers.',
  Inactive: 'Your device is currently inactive and cannot pour beers.',
  Unlocked:
    'Your device is currently unlocked and may be transferred to another account.',
};

type Props = {|
  deviceState: DeviceStatus,
|};

const DeviceStatusOverviewItem = ({ deviceState }: Props) => (
  <OverviewItem
    title="State"
    value={deviceState}
    description={DESCRIPTION_BY_DEVICE_STATE[deviceState]}
  />
);

export default DeviceStatusOverviewItem;
