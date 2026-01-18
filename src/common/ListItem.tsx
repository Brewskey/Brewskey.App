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
};

class ListItem<TItem> extends React.PureComponent<Props<TItem>> {
  _onPress = (): void => {
    if (this.props.swipeable) {
      this.props.onPress?.(this.props.item);
    } else if (this.props.item != null) {
      this.props.onPress?.(this.props.item);
    } else {
      // For non-swipeable items without an item, onPress should be () => void
      const onPress = this.props.onPress as (() => void) | undefined;
      onPress?.();
    }
  };

  render(): React.ReactElement {
    const {
      item,
      onPress: _2,
      rightIcon,
      swipeable,
      switch: switchParams,
      ...otherProps
    } = this.props;

    const content = (
      <>
        {this.props.leftAvatar}
        <RNEListItem.Content>
          <RNEListItem.Title style={[styles.title, this.props.titleStyle]}>
            {this.props.title}
          </RNEListItem.Title>
          <RNEListItem.Subtitle
            style={[styles.title, this.props.subtitleStyle]}
          >
            {this.props.subtitle}
          </RNEListItem.Subtitle>

          {this.props.chevron === true ? <RNEListItem.Chevron /> : null}
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
              value={switchParams.value}
              onValueChange={switchParams.onValueChange}
            />
          ) : null}
        </>
        {this.props.badge ? <Badge {...this.props.badge} /> : null}
      </>
    );

    if (swipeable) {
      return (
        <RNEListItem.Swipeable
          rightContent={this.props.slideoutComponent}
          {...otherProps}
          containerStyle={[styles.container, this.props.containerStyle]}
          onPress={this._onPress}
          bottomDivider
        >
          {content}
        </RNEListItem.Swipeable>
      );
    }

    return (
      <RNEListItem
        {...otherProps}
        containerStyle={[styles.container, this.props.containerStyle]}
        onPress={this._onPress}
        bottomDivider
      >
        {content}
      </RNEListItem>
    );
  }
}

export default ListItem;
