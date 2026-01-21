import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { COLORS } from '../theme';
import {
  Badge,
  BadgeProps,
  Icon,
  IconProps,
  ListItem as RNEListItem,
  Switch,
} from '@rneui/themed';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
  },
  subtitle: { color: COLORS.textFaded },
  title: { color: COLORS.text },
});

type Props<TItem> = (
  | ({
      swipeable: true;
      slideoutComponent: React.ReactNode;
      item: TItem;
      onPress?: ((item: TItem) => void) | undefined;
    } & Omit<React.ComponentProps<typeof RNEListItem.Swipeable>, 'onPress'>)
  | ({ swipeable?: false } & (
      | {
          item: TItem;
          onPress?: ((item: TItem) => void) | undefined;
        }
      | { item?: never; onPress?: (() => void) | undefined }
    ) &
      Omit<React.ComponentProps<typeof RNEListItem>, 'onPress'>)
) & {
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  leftAvatar?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightIcon?: IconProps | React.ReactElement;
  chevron?: boolean;
  badge?: BadgeProps | undefined;
  switch?: {
    onValueChange: (value: boolean) => void;
    value: boolean;
  };
  testID?: string;
};

function ListItem<TItem>(props: Props<TItem>): React.ReactElement {
  const {
    item,
    onPress: _2,
    rightIcon,
    swipeable,
    switch: switchParams,
    testID,
    title,
    leftAvatar,
    subtitle,
    badge,
    chevron,
    containerStyle,
    titleStyle,
    subtitleStyle,
    ...otherProps
  } = props;

  const _onPress = React.useCallback((): void => {
    if (swipeable) {
      props.onPress?.(props.item);
    } else if (item != null) {
      props.onPress?.(item);
    } else {
      // For non-swipeable items without an item, onPress should be () => void
      const onPress = props.onPress as (() => void) | undefined;
      onPress?.();
    }
  }, [swipeable, item, props]);

  const content = (
    <>
      {leftAvatar}
      <RNEListItem.Content>
        <RNEListItem.Title style={[styles.title, titleStyle]}>
          {title}
        </RNEListItem.Title>
        <RNEListItem.Subtitle style={[styles.title, subtitleStyle]}>
          {subtitle}
        </RNEListItem.Subtitle>

        {chevron === true ? <RNEListItem.Chevron /> : null}
      </RNEListItem.Content>
      <>
        {rightIcon != null ? (
          React.isValidElement(rightIcon) ? (
            rightIcon
          ) : (
            <Icon {...(rightIcon as IconProps)} />
          )
        ) : null}
        {switchParams != null ? (
          <Switch
            testID={testID ? `${testID}-switch` : undefined}
            value={switchParams.value}
            onValueChange={switchParams.onValueChange}
          />
        ) : null}
      </>
      {badge ? <Badge {...badge} /> : null}
    </>
  );

  if (swipeable) {
    const swipeableProps = props as Extract<Props<TItem>, { swipeable: true }>;
    return (
      <RNEListItem.Swipeable
        rightContent={swipeableProps.slideoutComponent}
        {...otherProps}
        containerStyle={[styles.container, containerStyle]}
        onPress={_onPress}
        testID={testID}
        bottomDivider
      >
        {content}
      </RNEListItem.Swipeable>
    );
  }

  return (
    <RNEListItem
      {...otherProps}
      containerStyle={[styles.container, containerStyle]}
      onPress={_onPress}
      testID={testID}
      bottomDivider
    >
      {content}
    </RNEListItem>
  );
}

export default React.memo(ListItem) as typeof ListItem;
