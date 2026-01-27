import * as React from 'react';

import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { FormLabel } from '../common/form/FormLabel';

export type LeaderboardDurationValue = 'P0D' | 'P30D' | 'P0DT12H';

interface LeaderboardDurationOptions {
  label: string;
  value: LeaderboardDurationValue;
}

export const LEADERBOARD_DURATION_OPTIONS = {
  TWELVE_HOURS: { label: 'Last 12 hours', value: 'P0DT12H' },
  // todo make it actual last month instead last 30 days
  MONTH: { label: 'Last month', value: 'P30D' },
  ALL_TIME: { label: 'All time', value: 'P0D' },
} as const;

const LEADERBOARD_DURATION_PICKER_VALUES: LeaderboardDurationOptions[] = [
  LEADERBOARD_DURATION_OPTIONS.TWELVE_HOURS,
  LEADERBOARD_DURATION_OPTIONS.MONTH,
  LEADERBOARD_DURATION_OPTIONS.ALL_TIME,
];

interface Props {
  value: LeaderboardDurationValue;
  onChange: (value: LeaderboardDurationValue) => void;
}

const LeaderBoardDurationPicker = ({
  onChange,
  value,
}: Props): React.ReactElement => (
  <View
    testID="leaderboard-duration-picker"
    style={{
      marginHorizontal: 16,
    }}
  >
    <FormLabel>Select Leaderboard duration</FormLabel>
    <Dropdown
      data={LEADERBOARD_DURATION_PICKER_VALUES}
      labelField="label"
      onChange={(item) => onChange(item.value)}
      placeholder="Leaderboard duration"
      valueField="value"
      value={LEADERBOARD_DURATION_PICKER_VALUES.find(
        (item) => item.value === value,
      )}
    />
  </View>
);

export { LeaderBoardDurationPicker };
