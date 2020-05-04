// @flow
import * as React from 'react';
import SimplePicker from '../components/pickers/SimplePicker';

export type LeaderboardDurationValue = 'P0D' | 'P30D' | 'P0DT12H';

type LeaderboardDurationOptions = {|
  label: string,
  value: LeaderboardDurationValue,
|};

/* eslint-disable sorting/sort-object-props */
export const LEADERBOARD_DURATION_OPTIONS: {
  [key: string]: LeaderboardDurationOptions,
} = {
  TWELVE_HOURS: { label: 'Last 12 hours', value: 'P0DT12H' },
  // todo make it actual last month instead last 30 days
  MONTH: { label: 'Last month', value: 'P30D' },
  ALL_TIME: { label: 'All time', value: 'P0D' },
};
/* eslint-enable */

const LEADERBOARD_DURATION_PICKER_VALUES: Array<LeaderboardDurationOptions> = [
  LEADERBOARD_DURATION_OPTIONS.TWELVE_HOURS,
  LEADERBOARD_DURATION_OPTIONS.MONTH,
  LEADERBOARD_DURATION_OPTIONS.ALL_TIME,
];

type Props = {|
  value: LeaderboardDurationValue,
  onChange: (value: ?LeaderboardDurationValue) => void,
|};

const LeaderBoardDurationPicker = ({ onChange, value }: Props): React.Node => (
  <SimplePicker
    doesRequireConfirmation={false}
    headerTitle="Select Leaderboard duration"
    label=" Leaderboard duration"
    onChange={onChange}
    pickerValues={LEADERBOARD_DURATION_PICKER_VALUES}
    value={value}
  />
);

export default LeaderBoardDurationPicker;
