import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { SectionContent } from 'common/SectionContent';
import { COLORS, TYPOGRAPHY } from 'theme';

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

type BaseProps<TExtraProps> = TExtraProps & {
  description?: string;
  paddedHorizontal?: boolean;
  testID?: string;
  title: string;
  value: string;
};

type Props<TExtraProps> = BaseProps<TExtraProps> & {
  leftComponent?:
    | React.ComponentType<BaseProps<TExtraProps>>
    | null
    | undefined;
  rightComponent?:
    | React.ComponentType<BaseProps<TExtraProps>>
    | null
    | undefined;
};

const OverviewItem = <TExtraProps,>({
  description,
  leftComponent: LeftComponent,
  paddedHorizontal = true,
  rightComponent: RightComponent,
  testID,
  title,
  value,
  ...otherProps
}: Props<TExtraProps>): React.ReactElement => (
  <SectionContent
    containerStyle={styles.container}
    paddedHorizontal={paddedHorizontal}
    testID={testID}
  >
    {LeftComponent == null ? null : (
      <View style={styles.leftComponentContainer}>
        <LeftComponent
          {...({
            description,
            paddedHorizontal,
            title,
            value,
            ...otherProps,
          } as BaseProps<TExtraProps>)}
        />
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
        <RightComponent
          {...({
            description,
            paddedHorizontal,
            title,
            value,
            ...otherProps,
          } as BaseProps<TExtraProps>)}
        />
      </View>
    )}
  </SectionContent>
);

const OverviewItem2 = React.memo(OverviewItem) as typeof OverviewItem;
export { OverviewItem2 };
