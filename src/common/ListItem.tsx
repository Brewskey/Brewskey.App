import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { COLORS } from '../theme';
import {
  Badge,
  BadgeProps,
  Icon,
  IconProps,
  ListItem as RNEListItem,
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
      slideoutComponent: React.ComponentType<{ item: TItem | undefined }>;
    } & Omit<React.ComponentProps<typeof RNEListItem.Swipeable>, 'onPress'>)
  | ({ swipeable?: false } & Omit<
      React.ComponentProps<typeof RNEListItem>,
      'onPress'
    >)
) & {
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  item?: TItem;
  onPress?: (item: TItem | undefined) => void;
  leftAvatar?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightIcon?: IconProps | React.ReactElement;
  chevron?: boolean;
  badge?: BadgeProps | undefined;
};

class ListItem<TItem> extends React.PureComponent<Props<TItem>> {
  _onPress = (): void => this.props.onPress?.(this.props.item);

  render(): React.ReactElement {
    const {
      item,
      onPress: _2,
      rightIcon,
      swipeable,
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
        {rightIcon != null ? (
          React.isValidElement(rightIcon) ? (
            rightIcon
          ) : (
            <Icon {...(rightIcon as IconProps)} />
          )
        ) : null}
        {this.props.badge ? <Badge {...this.props.badge} /> : null}
      </>
    );

    if (swipeable) {
      const SlideoutComponent = this.props.slideoutComponent;
      return (
        <RNEListItem.Swipeable
          rightContent={() => <SlideoutComponent item={item} />}
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
