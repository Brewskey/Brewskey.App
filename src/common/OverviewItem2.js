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

type BaseProps<TExtraProps> = {|
  ...TExtraProps,
  description?: string,
  paddedHorizontal: boolean,
  title: string,
  value: string,
|};

type Props<TExtraProps> = {|
  ...BaseProps<TExtraProps>,
  leftComponent: React.ComponentType<BaseProps<TExtraProps>>,
  rightComponent: React.ComponentType<BaseProps<TExtraProps>>,
|};

class OverviewItem<TExtraProps> extends React.PureComponent<
  Props<TExtraProps>,
> {
  static defaultProps = {
    paddedHorizontal: true,
  };

  render(): React.Node {
    const {
      description,
      leftComponent: LeftComponent,
      paddedHorizontal,
      rightComponent: RightComponent,
      title,
      value,
    } = this.props;

    const { leftComponent: _, rightComponent: _2, ...otherProps } = this.props;

    return (
      <SectionContent
        containerStyle={styles.container}
        paddedHorizontal={paddedHorizontal}
      >
        {LeftComponent == null ? null : (
          <View style={styles.leftComponentContainer}>
            <LeftComponent {...otherProps} />
          </View>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
        {RightComponent == null ? null : (
          <View style={styles.rightComponentContainer}>
            <RightComponent {...otherProps} />
          </View>
        )}
      </SectionContent>
    );
  }
}

export default OverviewItem;
