import { Fragment, isValidElement, memo, useCallback } from 'react';

import { Badge, Icon, ListItem as RNEListItem, Switch } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { COLORS } from 'theme';

import type { BadgeProps, IconProps } from '@rneui/themed';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

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
      slideoutComponent: ReactNode;
      item: TItem;
      onPress?: ((item: TItem) => void) | undefined;
      onSwipeBegin?: () => void;
    } & Omit<ComponentProps<typeof RNEListItem.Swipeable>, 'onPress'>)
  | ({ swipeable?: false } & (
      | {
          item: TItem;
          onPress?: ((item: TItem) => void) | undefined;
        }
      | { item?: never; onPress?: (() => void) | undefined }
    ) &
      Omit<ComponentProps<typeof RNEListItem>, 'onPress'>)
) & {
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  leftAvatar?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  rightIcon?: IconProps | ReactElement;
  chevron?: boolean;
  badge?: BadgeProps | undefined;
  switch?: {
    onValueChange: (value: boolean) => void;
    value: boolean;
  };
  testID?: string;
};

const ListItem = <TItem,>(props: Props<TItem>): ReactElement => {
  const {
    item,
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

  const onPressHandler = useCallback((): void => {
    const { onPress } = props;
    if (swipeable) {
      const swipeableProps = props;
      onPress?.(swipeableProps.item);
    } else if (item != null) {
      const itemProps = props as Extract<
        Props<TItem>,
        { swipeable?: false; item: TItem }
      >;
      itemProps.onPress?.(item);
    } else {
      // For non-swipeable items without an item, onPress should be () => void
      const noItemProps = props as Extract<
        Props<TItem>,
        { swipeable?: false; item?: never }
      >;
      const fn = noItemProps.onPress as (() => void) | undefined;
      fn?.();
    }
  }, [swipeable, item, props]);

  let rightIconElement: React.ReactNode = null;
  if (rightIcon != null) {
    rightIconElement = isValidElement(rightIcon) ? (
      rightIcon
    ) : (
      <Icon {...rightIcon} />
    );
  }

  const content = (
    <Fragment>
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
      <Fragment>
        {rightIconElement}
        {switchParams != null ? (
          <Switch
            onValueChange={switchParams.onValueChange}
            testID={testID ? `${testID}-switch` : undefined}
            value={switchParams.value}
          />
        ) : null}
      </Fragment>
      {badge ? <Badge {...badge} /> : null}
    </Fragment>
  );

  if (swipeable) {
    const swipeableProps = props;
    return (
      <RNEListItem.Swipeable
        rightContent={swipeableProps.slideoutComponent}
        {...otherProps}
        bottomDivider
        containerStyle={[styles.container, containerStyle]}
        onPress={onPressHandler}
        onSwipeBegin={swipeableProps.onSwipeBegin}
        testID={testID}
      >
        {content}
      </RNEListItem.Swipeable>
    );
  }

  return (
    <RNEListItem
      {...otherProps}
      bottomDivider
      containerStyle={[styles.container, containerStyle]}
      onPress={onPressHandler}
      testID={testID}
    >
      {content}
    </RNEListItem>
  );
};

const ListItemMemo = memo(ListItem) as typeof ListItem;
export { ListItemMemo as ListItem };
