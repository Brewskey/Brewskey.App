// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SectionContent from './SectionContent';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: COLORS.secondary2,
    flexDirection: 'row',
  },
  description: {
    ...TYPOGRAPHY.small,
  },
  leftComponentContainer: {
    alignSelf: 'center',
    paddingRight: 10,
  },
  rightComponentContainer: {
    alignSelf: 'center',
    marginLeft: 'auto',
    paddingLeft: 10,
  },
  title: {
    ...TYPOGRAPHY.secondary,
  },
  value: {
    ...TYPOGRAPHY.paragraph,
  },
});

type Props<TExtraProps = {}> = {
  ...TExtraProps,
  description?: string,
  leftComponent: React.ComponentType<Props<TExtraProps>>,
  paddedHorizontal: boolean,
  rightComponent: React.ComponentType<Props<TExtraProps>>,
  title: string,
  value: string,
};

class OverviewItem<TExtraProps> extends React.PureComponent<
  Props<TExtraProps>,
> {
  static defaultProps = {
    paddedHorizontal: true,
  };

  render() {
    const {
      description,
      leftComponent: LeftComponent,
      paddedHorizontal,
      rightComponent: RightComponent,
      title,
      value,
    } = this.props;

    return (
      <SectionContent
        containerStyle={styles.container}
        paddedHorizontal={paddedHorizontal}
      >
        {LeftComponent && (
          <View style={styles.leftComponentContainer}>
            <LeftComponent {...this.props} />
          </View>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {value && <Text style={styles.value}>{value}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
        {RightComponent && (
          <View style={styles.rightComponentContainer}>
            <RightComponent {...this.props} />
          </View>
        )}
      </SectionContent>
    );
  }
}

export default OverviewItem;
