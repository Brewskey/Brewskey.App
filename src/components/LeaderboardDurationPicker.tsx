import * as React from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FormLabel } from '../common/form/FormLabel';

export type LeaderboardDurationValue = 'P0D' | 'P30D' | 'P0DT12H';

type DurationKeys = 'TWELVE_HOURS' | 'MONTH' | 'ALL_TIME';

type LeaderboardDurationOptions = {
  label: string;
  value: LeaderboardDurationValue;
};

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

type Props = {
  value: LeaderboardDurationValue;
  onChange: (value: LeaderboardDurationValue) => void;
};

const LeaderBoardDurationPicker = ({
  onChange,
  value,
}: Props): React.ReactElement => (
  <View
    style={{
      marginHorizontal: 16,
    }}
    testID="leaderboard-duration-picker"
  >
    <FormLabel>Select Leaderboard duration</FormLabel>
    <Dropdown
      placeholder="Leaderboard duration"
      labelField="label"
      valueField="value"
      onChange={(item) => onChange(item.value)}
      data={LEADERBOARD_DURATION_PICKER_VALUES}
      value={LEADERBOARD_DURATION_PICKER_VALUES.find((item) => item.value === value)}
    />
  </View>
);

export default LeaderBoardDurationPicker;
