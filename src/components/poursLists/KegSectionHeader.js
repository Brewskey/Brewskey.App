// @flow

import type { KegSection } from '../../stores/SectionPoursListStore';

import * as React from 'react';
import moment from 'moment';
import { StyleSheet, Text, View } from 'react-native';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { NULL_STRING_PLACEHOLDER } from '../../constants';

const styles = StyleSheet.create({
  beverageNameText: {
    ...TYPOGRAPHY.secondary,
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.secondary2,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateContainer: {
    paddingRight: 32,
  },
  dateLabelText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
  },
  datesContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
});

type Props = {
  section: KegSection,
};

class KegSectionHeader extends React.Component<Props> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {
      section: { beverage, floatedDate, tapDate },
    } = this.props;

    return (
      <View style={styles.container}>
        <BeverageAvatar beverageId={beverage.id} />
        <View style={styles.textContainer}>
          <Text style={styles.beverageNameText}>{beverage.name}</Text>
          <View style={styles.datesContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabelText}>created date:</Text>
              <Text>{moment(tapDate).format('l')}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabelText}>floated date:</Text>
              <Text>
                {floatedDate
                  ? moment(floatedDate).format('l')
                  : NULL_STRING_PLACEHOLDER}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default KegSectionHeader;
