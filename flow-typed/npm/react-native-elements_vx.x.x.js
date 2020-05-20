// flow-typed signature: b3c4d063e4880d223e95b35e053fd31c
// flow-typed version: <<STUB>>/react-native-elements_v^2.0.0/flow_v0.125.1

declare module 'react-native-elements' {
  declare type Color = string | number;

  declare type Transform =
    | { perspective: number }
    | { scale: number }
    | { scaleX: number }
    | { scaleY: number }
    | { translateX: number }
    | { translateY: number }
    | { rotate: string }
    | { rotateX: string }
    | { rotateY: string }
    | { rotateZ: string }
    | { skewX: string }
    | { skewY: string };

  declare type TransformPropTypes = {|
    transform?: Array<Transform>,
  |};

  declare type LayoutPropTypes = {|
    /** `display` sets the display type of this component.
     *
     *  It works similarly to `display` in CSS, but only support 'flex' and 'none'.
     *  'flex' is the default.
     */
    display?: 'flex' | 'none',

    /** `width` sets the width of this component.
     *
     *  It works similarly to `width` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/width for more details.
     */
    width?: number | string,

    /** `height` sets the height of this component.
     *
     *  It works similarly to `height` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/height for more details.
     */
    height?: number | string,

    /** `top` is the number of logical pixels to offset the top edge of
     *  this component.
     *
     *  It works similarly to `top` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/top
     *  for more details of how `top` affects layout.
     */
    top?: number | string,

    /** `left` is the number of logical pixels to offset the left edge of
     *  this component.
     *
     *  It works similarly to `left` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/left
     *  for more details of how `left` affects layout.
     */
    left?: number | string,

    /** `right` is the number of logical pixels to offset the right edge of
     *  this component.
     *
     *  It works similarly to `right` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/right
     *  for more details of how `right` affects layout.
     */
    right?: number | string,

    /** `bottom` is the number of logical pixels to offset the bottom edge of
     *  this component.
     *
     *  It works similarly to `bottom` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/bottom
     *  for more details of how `bottom` affects layout.
     */
    bottom?: number | string,

    /** `minWidth` is the minimum width for this component, in logical pixels.
     *
     *  It works similarly to `min-width` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/min-width
     *  for more details.
     */
    minWidth?: number | string,

    /** `maxWidth` is the maximum width for this component, in logical pixels.
     *
     *  It works similarly to `max-width` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/max-width
     *  for more details.
     */
    maxWidth?: number | string,

    /** `minHeight` is the minimum height for this component, in logical pixels.
     *
     *  It works similarly to `min-height` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/min-height
     *  for more details.
     */
    minHeight?: number | string,

    /** `maxHeight` is the maximum height for this component, in logical pixels.
     *
     *  It works similarly to `max-height` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/max-height
     *  for more details.
     */
    maxHeight?: number | string,

    /** Setting `margin` has the same effect as setting each of
     *  `marginTop`, `marginLeft`, `marginBottom`, and `marginRight`.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin
     *  for more details.
     */
    margin?: number | string,

    /** Setting `marginVertical` has the same effect as setting both
     *  `marginTop` and `marginBottom`.
     */
    marginVertical?: number | string,

    /** Setting `marginHorizontal` has the same effect as setting
     *  both `marginLeft` and `marginRight`.
     */
    marginHorizontal?: number | string,

    /** `marginTop` works like `margin-top` in CSS.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top
     *  for more details.
     */
    marginTop?: number | string,

    /** `marginBottom` works like `margin-bottom` in CSS.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom
     *  for more details.
     */
    marginBottom?: number | string,

    /** `marginLeft` works like `margin-left` in CSS.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left
     *  for more details.
     */
    marginLeft?: number | string,

    /** `marginRight` works like `margin-right` in CSS.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right
     *  for more details.
     */
    marginRight?: number | string,

    /** Setting `padding` has the same effect as setting each of
     *  `paddingTop`, `paddingBottom`, `paddingLeft`, and `paddingRight`.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/padding
     *  for more details.
     */
    padding?: number | string,

    /** Setting `paddingVertical` is like setting both of
     *  `paddingTop` and `paddingBottom`.
     */
    paddingVertical?: number | string,

    /** Setting `paddingHorizontal` is like setting both of
     *  `paddingLeft` and `paddingRight`.
     */
    paddingHorizontal?: number | string,

    /** `paddingTop` works like `padding-top` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top
     * for more details.
     */
    paddingTop?: number | string,

    /** `paddingBottom` works like `padding-bottom` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom
     * for more details.
     */
    paddingBottom?: number | string,

    /** `paddingLeft` works like `padding-left` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left
     * for more details.
     */
    paddingLeft?: number | string,

    /** `paddingRight` works like `padding-right` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right
     * for more details.
     */
    paddingRight?: number | string,

    /** `borderWidth` works like `border-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-width
     * for more details.
     */
    borderWidth?: number,

    /** `borderTopWidth` works like `border-top-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width
     * for more details.
     */
    borderTopWidth?: number,

    /** `borderRightWidth` works like `border-right-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width
     * for more details.
     */
    borderRightWidth?: number,

    /** `borderBottomWidth` works like `border-bottom-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width
     * for more details.
     */
    borderBottomWidth?: number,

    /** `borderLeftWidth` works like `border-left-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width
     * for more details.
     */
    borderLeftWidth?: number,

    /** `position` in React Native is similar to regular CSS, but
     *  everything is set to `relative` by default, so `absolute`
     *  positioning is always just relative to the parent.
     *
     *  If you want to position a child using specific numbers of logical
     *  pixels relative to its parent, set the child to have `absolute`
     *  position.
     *
     *  If you want to position a child relative to something
     *  that is not its parent, just don't use styles for that. Use the
     *  component tree.
     *
     *  See https://github.com/facebook/yoga
     *  for more details on how `position` differs between React Native
     *  and CSS.
     */
    position?: 'absolute' | 'relative',

    /** `flexDirection` controls which directions children of a container go.
     *  `row` goes left to right, `column` goes top to bottom, and you may
     *  be able to guess what the other two do. It works like `flex-direction`
     *  in CSS, except the default is `column`.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction
     *  for more details.
     */
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse',

    /** `flexWrap` controls whether children can wrap around after they
     *  hit the end of a flex container.
     *  It works like `flex-wrap` in CSS (default: nowrap).
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap
     *  for more details.
     */
    flexWrap?: 'wrap' | 'nowrap',

    /** `justifyContent` aligns children in the main direction.
     *  For example, if children are flowing vertically, `justifyContent`
     *  controls how they align vertically.
     *  It works like `justify-content` in CSS (default: flex-start).
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
     *  for more details.
     */
    justifyContent?:
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'space-between'
      | 'space-around',

    /** `alignItems` aligns children in the cross direction.
     *  For example, if children are flowing vertically, `alignItems`
     *  controls how they align horizontally.
     *  It works like `align-items` in CSS (default: stretch).
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
     *  for more details.
     */
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',

    /** `alignSelf` controls how a child aligns in the cross direction,
     *  overriding the `alignItems` of the parent. It works like `align-self`
     *  in CSS (default: auto).
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/align-self
     *  for more details.
     */
    alignSelf?:
      | 'auto'
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'stretch'
      | 'baseline',

    /** `alignContent` controls how rows align in the cross direction,
     *  overriding the `alignContent` of the parent.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/align-content
     *  for more details.
     */
    alignContent?:
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'stretch'
      | 'space-between'
      | 'space-around',

    /** `overflow` controls how a children are measured and displayed.
     *  `overflow: hidden` causes views to be clipped while `overflow: scroll`
     *  causes views to be measured independently of their parents main axis.`
     *  It works like `overflow` in CSS (default: visible).
     *  See https://developer.mozilla.org/en/docs/Web/CSS/overflow
     *  for more details.
     */
    overflow?: 'visible' | 'hidden' | 'scroll',

    /** In React Native `flex` does not work the same way that it does in CSS.
     *  `flex` is a number rather than a string, and it works
     *  according to the `Yoga` library
     *  at https://github.com/facebook/yoga
     *
     *  When `flex` is a positive number, it makes the component flexible
     *  and it will be sized proportional to its flex value. So a
     *  component with `flex` set to 2 will take twice the space as a
     *  component with `flex` set to 1.
     *
     *  When `flex` is 0, the component is sized according to `width`
     *  and `height` and it is inflexible.
     *
     *  When `flex` is -1, the component is normally sized according
     *  `width` and `height`. However, if there's not enough space,
     *  the component will shrink to its `minWidth` and `minHeight`.
     *
     * flexGrow, flexShrink, and flexBasis work the same as in CSS.
     */
    flex?: number,
    flexGrow?: number,
    flexShrink?: number,
    flexBasis?: number | string,

    /**
     * Aspect ratio control the size of the undefined dimension of a node. Aspect ratio is a
     * non-standard property only available in react native and not CSS.
     *
     * - On a node with a set width/height aspect ratio control the size of the unset dimension
     * - On a node with a set flex basis aspect ratio controls the size of the node in the cross axis
     *   if unset
     * - On a node with a measure function aspect ratio works as though the measure function measures
     *   the flex basis
     * - On a node with flex grow/shrink aspect ratio controls the size of the node in the cross axis
     *   if unset
     * - Aspect ratio takes min/max dimensions into account
     */
    aspectRatio?: number,

    /** `zIndex` controls which components display on top of others.
     *  Normally, you don't use `zIndex`. Components render according to
     *  their order in the document tree, so later components draw over
     *  earlier ones. `zIndex` may be useful if you have animations or custom
     *  modal interfaces where you don't want this behavior.
     *
     *  It works like the CSS `z-index` property - components with a larger
     *  `zIndex` will render on top. Think of the z-direction like it's
     *  pointing from the phone into your eyeball.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/z-index for
     *  more details.
     */
    zIndex?: number,

    /** `direction` specifies the directional flow of the user interface.
     *  The default is `inherit`, except for root node which will have
     *  value based on the current locale.
     *  See https://facebook.github.io/yoga/docs/rtl/
     *  for more details.
     *  @platform ios
     */
    direction?: 'inherit' | 'ltr' | 'rtl',
  |};

  declare type ShadowPropTypes = {|
    /**
     * Sets the drop shadow color
     * @platform ios
     */
    shadowColor?: Color,

    /**
     * Sets the drop shadow offset
     * @platform ios
     */
    shadowOffset?: {|
      width?: number,
      height?: number,
    |},

    /**
     * Sets the drop shadow opacity (multiplied by the color's alpha component)
     * @platform ios
     */
    shadowOpacity?: number,

    /**
     * Sets the drop shadow blur radius
     * @platform ios
     */
    shadowRadius?: number,
  |};

  declare type ExtraViewStylePropTypes = {|
    backfaceVisibility?: 'visible' | 'hidden',
    backgroundColor?: Color,
    borderColor?: Color,
    borderTopColor?: Color,
    borderRightColor?: Color,
    borderBottomColor?: Color,
    borderLeftColor?: Color,
    borderRadius?: number,
    borderTopLeftRadius?: number,
    borderTopRightRadius?: number,
    borderBottomLeftRadius?: number,
    borderBottomRightRadius?: number,
    borderStyle?: 'solid' | 'dotted' | 'dashed',
    borderWidth?: number,
    borderTopWidth?: number,
    borderRightWidth?: number,
    borderBottomWidth?: number,
    borderLeftWidth?: number,
    opacity?: number,
    /**
     * (Android-only) Sets the elevation of a view, using Android's underlying
     * [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation).
     * This adds a drop shadow to the item and affects z-order for overlapping views.
     * Only supported on Android 5.0+, has no effect on earlier versions.
     * @platform android
     */
    elevation?: number,
  |};

  declare type FontVariant =
    | 'small-caps'
    | 'oldstyle-nums'
    | 'lining-nums'
    | 'tabular-nums'
    | 'proportional-nums';

  declare type ExtraTextStylePropTypes = {|
    color?: Color,
    fontFamily?: string,
    fontSize?: number,
    fontStyle?: 'normal' | 'italic',
    /**
     * Specifies font weight. The values 'normal' and 'bold' are supported for
     * most fonts. Not all fonts have a variant for each of the numeric values,
     * in that case the closest one is chosen.
     */
    fontWeight?:
      | 'normal'
      | 'bold'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900',
    /**
     * @platform ios
     */
    fontVariant?: Array<FontVariant>,
    textShadowOffset?: {|
      width?: number,
      height?: number,
    |},
    textShadowRadius?: number,
    textShadowColor?: Color,
    /**
     * @platform ios
     */
    letterSpacing?: number,
    lineHeight?: number,
    /**
     * Specifies text alignment. The value 'justify' is only supported on iOS and
     * fallbacks to `left` on Android.
     */
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify',
    /**
     * @platform android
     */
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center',
    /**
     * Set to `false` to remove extra font padding intended to make space for certain ascenders / descenders.
     * With some fonts, this padding can make text look slightly misaligned when centered vertically.
     * For best results also set `textAlignVertical` to `center`. Default is true.
     * @platform android
     */
    includeFontPadding?: boolean,
    textDecorationLine?:
      | 'none'
      | 'underline'
      | 'line-through'
      | 'underline line-through',
    /**
     * @platform ios
     */
    textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed',
    /**
     * @platform ios
     */
    textDecorationColor?: Color,
    /**
     * @platform ios
     */
    writingDirection?: 'auto' | 'ltr' | 'rtl',
  |};

  declare type ImageResizeModeEnum = {|
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
    repeat: 'repeat',
  |};

  declare type ExtraImageStylePropTypes = {|
    resizeMode?: $Keys<ImageResizeModeEnum>,
    backfaceVisibility?: 'visible' | 'hidden',
    backgroundColor?: Color,
    borderColor?: Color,
    borderWidth?: number,
    borderRadius?: number,
    overflow?: 'visible' | 'hidden',

    /**
     * Changes the color of all the non-transparent pixels to the tintColor.
     */
    tintColor?: Color,
    opacity?: number,
    /**
     * When the image has rounded corners, specifying an overlayColor will
     * cause the remaining space in the corners to be filled with a solid color.
     * This is useful in cases which are not supported by the Android
     * implementation of rounded corners:
     *   - Certain resize modes, such as 'contain'
     *   - Animated GIFs
     *
     * A typical way to use this prop is with images displayed on a solid
     * background and setting the `overlayColor` to the same color
     * as the background.
     *
     * For details of how this works under the hood, see
     * http://frescolib.org/docs/rounded-corners-and-circles.html
     *
     * @platform android
     */
    overlayColor?: string,

    // Android-Specific styles
    borderTopLeftRadius?: number,
    borderTopRightRadius?: number,
    borderBottomLeftRadius?: number,
    borderBottomRightRadius?: number,
  |};

  declare type ViewStyle = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraViewStylePropTypes,
  |};

  declare type TextStyle = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraViewStylePropTypes,
    ...ExtraTextStylePropTypes,
  |};

  declare type ImageStyle = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraImageStylePropTypes,
  |};

  declare type StylePropTypes = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraImageStylePropTypes,
    ...ExtraTextStylePropTypes,
    ...ExtraViewStylePropTypes,
  |};

  declare type StyleId = number;

  declare type Styles = { [key: string]: StylePropTypes };
  declare type StyleRuleSet<S: Styles> = { [key: $Keys<S>]: StyleId };

  declare export var StyleSheet: {|
    hairlineWidth: number,
    absoluteFill: StyleId,
    absoluteFillObject: Object,
    flatten: (style: StyleProp<StylePropTypes, StyleId>) => StylePropTypes,
    create<S: Styles>(styles: S): StyleRuleSet<S>,
    setStyleAttributePreprocessor(
      property: string,
      process: (nextProp: mixed) => mixed,
    ): void,
  |};

  declare type EdgeInsetsProp = {|
    top: number,
    left: number,
    bottom: number,
    right: number,
  |};

  declare type AccessibilityTrait =
    | 'none'
    | 'button'
    | 'link'
    | 'header'
    | 'search'
    | 'image'
    | 'selected'
    | 'plays'
    | 'key'
    | 'text'
    | 'summary'
    | 'disabled'
    | 'frequentUpdates'
    | 'startsMedia'
    | 'adjustable'
    | 'allowsDirectInteraction'
    | 'pageTurn';

  declare type AccessibilityComponentType =
    | 'none'
    | 'button'
    | 'radiobutton_checked'
    | 'radiobutton_unchecked';

  declare type MeasureOnSuccessCallback = (
    x: number,
    y: number,
    width: number,
    height: number,
    pageX: number,
    pageY: number,
  ) => void;

  declare type MeasureInWindowOnSuccessCallback = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;

  declare type MeasureLayoutOnSuccessCallback = (
    left: number,
    top: number,
    width: number,
    height: number,
  ) => void;

  declare type NativeMethodsMixinType = {|
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: Object): void,
  |};

  declare type ImageRequireSource = number;
  declare type ImageURISource = {|
    /**
     * `uri` is a string representing the resource identifier for the image, which
     * could be an http address, a local file path, or the name of a static image
     * resource (which should be wrapped in the `require('./path/to/image.png')`
     * function).
     */
    uri?: string,
    /**
     * `bundle` is the iOS asset bundle which the image is included in. This
     * will default to [NSBundle mainBundle] if not set.
     * @platform ios
     */
    bundle?: string,
    /**
     * `method` is the HTTP Method to use. Defaults to GET if not specified.
     */
    method?: string,
    /**
     * `headers` is an object representing the HTTP headers to send along with the
     * request for a remote image.
     */
    headers?: { [key: string]: string },
    /**
     * `cache` determines how the requests handles potentially cached
     * responses.
     *
     * - `default`: Use the native platforms default strategy. `useProtocolCachePolicy` on iOS.
     *
     * - `reload`: The data for the URL will be loaded from the originating source.
     * No existing cache data should be used to satisfy a URL load request.
     *
     * - `force-cache`: The existing cached data will be used to satisfy the request,
     * regardless of its age or expiration date. If there is no existing data in the cache
     * corresponding the request, the data is loaded from the originating source.
     *
     * - `only-if-cached`: The existing cache data will be used to satisfy a request, regardless of
     * its age or expiration date. If there is no existing data in the cache corresponding
     * to a URL load request, no attempt is made to load the data from the originating source,
     * and the load is considered to have failed.
     *
     * @platform ios
     */
    cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached',
    /**
     * `body` is the HTTP body to send with the request. This must be a valid
     * UTF-8 string, and will be sent exactly as specified, with no
     * additional encoding (e.g. URL-escaping or base64) applied.
     */
    body?: string,
    /**
     * `width` and `height` can be specified if known at build time, in which case
     * these will be used to set the default `<Image/>` component dimensions.
     */
    width?: number,
    height?: number,
    /**
     * `scale` is used to indicate the scale factor of the image. Defaults to 1.0 if
     * unspecified, meaning that one image pixel equates to one display point / DIP.
     */
    scale?: number,
  |};
  declare type ImageSourcePropType =
    | ImageURISource
    | ImageURISource[]
    | ImageRequireSource;

  declare type TextProperties = {|
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
    numberOfLines?: number,
    textBreakStrategy?: 'simple' | 'highQuality' | 'balanced',
    onLayout?: Function,
    onPress?: Function,
    onLongPress?: Function,
    pressRetentionOffset?: EdgeInsetsProp,
    selectable?: boolean,
    selectionColor?: Color,
    suppressHighlighting?: boolean,
    testID?: string,
    nativeID?: string,
    allowFontScaling?: boolean,
    accessible?: boolean,
    adjustsFontSizeToFit?: boolean,
    minimumFontScale?: number,
    disabled?: boolean,
    style?: StyleProp<TextStylePropTypes, StyleId>,
    children?: React$Node,
  |};

  declare type ViewProperties = {|
    accessible?: boolean,
    accessibilityLabel?: React$PropType$Primitive<any>,
    accessibilityComponentType?: AccessibilityComponentType,
    accessibilityLiveRegion?: 'none' | 'polite' | 'assertive',
    importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants',
    accessibilityTraits?: AccessibilityTrait | Array<AccessibilityTrait>,
    accessibilityViewIsModal?: boolean,
    onAccessibilityTap?: Function,
    onMagicTap?: Function,
    testID?: string,
    nativeID?: string,
    onResponderGrant?: Function,
    onResponderMove?: Function,
    onResponderReject?: Function,
    onResponderRelease?: Function,
    onResponderTerminate?: Function,
    onResponderTerminationRequest?: Function,
    onStartShouldSetResponder?: Function,
    onStartShouldSetResponderCapture?: Function,
    onMoveShouldSetResponder?: Function,
    onMoveShouldSetResponderCapture?: Function,
    hitSlop?: EdgeInsetsProp,
    pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto',
    style?: StyleProp<ViewStylePropTypes, StyleId>,
    removeClippedSubviews?: boolean,
    renderToHardwareTextureAndroid?: boolean,
    shouldRasterizeIOS?: boolean,
    collapsable?: boolean,
    needsOffscreenAlphaCompositing?: boolean,
    children?: React$Element<*>,
  |};
  declare type StatusBarStyle = $Enum<{
    /**
     * Default status bar style (dark for iOS, light for Android)
     */
    default: string,
    /**
     * Dark background, white texts and icons
     */
    'light-content': string,
    /**
     * Light background, dark texts and icons
     */
    'dark-content': string,
  }>;
  declare type RNImageProps = {|
    /**
     * > `ImageResizeMode` is an `Enum` for different image resizing modes, set via the
     * > `resizeMode` style property on `Image` components. The values are `contain`, `cover`,
     * > `stretch`, `center`, `repeat`.
     */
    style?: StyleProp<ImageStylePropTypes, StyleId>,
    /**
     * The image source (either a remote URL or a local file resource).
     *
     * This prop can also contain several remote URLs, specified together with
     * their width and height and potentially with scale/other URI arguments.
     * The native side will then choose the best `uri` to display based on the
     * measured size of the image container. A `cache` property can be added to
     * control how networked request interacts with the local cache.
     *
     * The currently supported formats are `png`, `jpg`, `jpeg`, `bmp`, `gif`,
     * `webp` (Android only), `psd` (iOS only).
     */
    source?: ImageSourcePropType,
    /**
     * A static image to display while loading the image source.
     *
     * - `uri` - a string representing the resource identifier for the image, which
     * should be either a local file path or the name of a static image resource
     * (which should be wrapped in the `require('./path/to/image.png')` function).
     * - `width`, `height` - can be specified if known at build time, in which case
     * these will be used to set the default `<Image/>` component dimensions.
     * - `scale` - used to indicate the scale factor of the image. Defaults to 1.0 if
     * unspecified, meaning that one image pixel equates to one display point / DIP.
     * - `number` - Opaque type returned by something like `require('./image.jpg')`.
     *
     * @platform ios
     */
    defaultSource?: ImageSourcePropType,
    /**
     * When true, indicates the image is an accessibility element.
     * @platform ios
     */
    accessible?: boolean,
    /**
     * The text that's read by the screen reader when the user interacts with
     * the image.
     * @platform ios
     */
    accessibilityLabel?: React$PropType$Primitive<any>,
    /**
     * blurRadius: the blur radius of the blur filter added to the image
     */
    blurRadius?: number,
    /**
     * When the image is resized, the corners of the size specified
     * by `capInsets` will stay a fixed size, but the center content and borders
     * of the image will be stretched.  This is useful for creating resizable
     * rounded buttons, shadows, and other resizable assets.  More info in the
     * [official Apple documentation](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html#//apple_ref/occ/instm/UIImage/resizableImageWithCapInsets).
     *
     * @platform ios
     */
    capInsets?: EdgeInsetsPropType,
    /**
     * The mechanism that should be used to resize the image when the image's dimensions
     * differ from the image view's dimensions. Defaults to `auto`.
     *
     * - `auto`: Use heuristics to pick between `resize` and `scale`.
     *
     * - `resize`: A software operation which changes the encoded image in memory before it
     * gets decoded. This should be used instead of `scale` when the image is much larger
     * than the view.
     *
     * - `scale`: The image gets drawn downscaled or upscaled. Compared to `resize`, `scale` is
     * faster (usually hardware accelerated) and produces higher quality images. This
     * should be used if the image is smaller than the view. It should also be used if the
     * image is slightly bigger than the view.
     *
     * More details about `resize` and `scale` can be found at http://frescolib.org/docs/resizing-rotating.html.
     *
     * @platform android
     */
    resizeMethod?: 'auto' | 'resize' | 'scale',
    /**
     * Determines how to resize the image when the frame doesn't match the raw
     * image dimensions.
     *
     * - `cover`: Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal
     * to or larger than the corresponding dimension of the view (minus padding).
     *
     * - `contain`: Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal to
     * or less than the corresponding dimension of the view (minus padding).
     *
     * - `stretch`: Scale width and height independently, This may change the
     * aspect ratio of the src.
     *
     * - `repeat`: Repeat the image to cover the frame of the view. The
     * image will keep it's size and aspect ratio. (iOS only)
     */
    resizeMode?: $Keys<ImageResizeModeEnum>,
    /**
     * A unique identifier for this element to be used in UI Automation
     * testing scripts.
     */
    testID?: string,
    /**
     * Invoked on mount and layout changes with
     * `{nativeEvent: {layout: {x, y, width, height}}}`.
     */
    onLayout?: Function,
    /**
     * Invoked on load start.
     *
     * e.g., `onLoadStart={(e) => this.setState({loading: true})}`
     */
    onLoadStart?: Function,
    /**
     * Invoked on download progress with `{nativeEvent: {loaded, total}}`.
     * @platform ios
     */
    onProgress?: Function,
    /**
     * Invoked on load error with `{nativeEvent: {error}}`.
     */
    onError?: Function,
    /**
     * Invoked when a partial load of the image is complete. The definition of
     * what constitutes a "partial load" is loader specific though this is meant
     * for progressive JPEG loads.
     * @platform ios
     */
    onPartialLoad?: Function,
    /**
     * Invoked when load completes successfully.
     */
    onLoad?: Function,
    /**
     * Invoked when load either succeeds or fails.
     */
    onLoadEnd?: Function,
    children?: React$Element<*>,
  |};

  declare type ModalProps = {|
    /**
     * @deprecated Use animationType instead
     */
    animated?: boolean,
    /**
     * The `animationType` prop controls how the modal animates.
     *
     * - `slide` slides in from the bottom
     * - `fade` fades into view
     * - `none` appears without an animation
     */
    animationType?: 'none' | 'slide' | 'fade',
    /**
     * The `transparent` prop determines whether your modal will fill the entire view.
     * Setting this to `true` will render the modal over a transparent background.
     */
    transparent?: boolean,
    /**
     * The `visible` prop determines whether your modal is visible.
     */
    visible?: boolean,
    /**
     * The `onRequestClose` prop allows passing a function that will be called once the modal has been dismissed.
     * _On the Android platform, this is a required function._
     */
    onRequestClose?: () => void,
    /**
     * The `onShow` prop allows passing a function that will be called once the modal has been shown.
     */
    onShow?: (event: SyntheticEvent<any>) => void,

    /**
     * The `presentationStyle` determines the style of modal to show
     */
    presentationStyle?:
      | 'fullScreen'
      | 'pageSheet'
      | 'formSheet'
      | 'overFullScreen',

    /**
     * The `supportedOrientations` prop allows the modal to be rotated to any of the specified orientations.
     * On iOS, the modal is still restricted by what's specified in your app's Info.plist's UISupportedInterfaceOrientations field.
     */
    supportedOrientations?: Array<
      | 'portrait'
      | 'portrait-upside-down'
      | 'landscape'
      | 'landscape-left'
      | 'landscape-right',
    >,

    /**
     * The `onDismiss` prop allows passing a function that will be called once the modal has been dismissed.
     */
    onDismiss?: () => void,

    /**
     * The `onOrientationChange` callback is called when the orientation changes while the modal is being displayed.
     * The orientation provided is only 'portrait' or 'landscape'. This callback is also called on initial render, regardless of the current orientation.
     */
    onOrientationChange?: (event: NativeSyntheticEvent<any>) => void,
    hardwareAccelerated?: boolean,
  |};

  declare type TextInputProps = {|
    ...ViewProperties,
    /**
     * Can tell `TextInput` to automatically capitalize certain characters.
     *
     * - `characters`: all characters.
     * - `words`: first letter of each word.
     * - `sentences`: first letter of each sentence (*default*).
     * - `none`: don't auto capitalize anything.
     */
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
    /**
     * If `false`, disables auto-correct. The default value is `true`.
     */
    autoCorrect?: boolean,
    /**
     * If `false`, disables spell-check style (i.e. red underlines).
     * The default value is inherited from `autoCorrect`.
     * @platform ios
     */
    spellCheck?: boolean,
    /**
     * If `true`, focuses the input on `componentDidMount`.
     * The default value is `false`.
     */
    autoFocus?: boolean,
    /**
     * If `false`, text is not editable. The default value is `true`.
     */
    editable?: boolean,
    /**
     * Determines which keyboard to open, e.g.`numeric`.
     *
     * The following values work across platforms:
     *
     * - `default`
     * - `numeric`
     * - `email-address`
     * - `phone-pad`
     */
    keyboardType?:  // Cross-platform
      | 'default'
      | 'email-address'
      | 'numeric'
      | 'phone-pad'
      // iOS-only
      | 'ascii-capable'
      | 'numbers-and-punctuation'
      | 'url'
      | 'number-pad'
      | 'name-phone-pad'
      | 'decimal-pad'
      | 'twitter'
      | 'web-search',
    /**
     * Determines the color of the keyboard.
     * @platform ios
     */
    keyboardAppearance?: 'default' | 'light' | 'dark',
    /**
     * Determines how the return key should look. On Android you can also use
     * `returnKeyLabel`.
     *
     * *Cross platform*
     *
     * The following values work across platforms:
     *
     * - `done`
     * - `go`
     * - `next`
     * - `search`
     * - `send`
     *
     * *Android Only*
     *
     * The following values work on Android only:
     *
     * - `none`
     * - `previous`
     *
     * *iOS Only*
     *
     * The following values work on iOS only:
     *
     * - `default`
     * - `emergency-call`
     * - `google`
     * - `join`
     * - `route`
     * - `yahoo`
     */
    returnKeyType?:  // Cross-platform
      | 'done'
      | 'go'
      | 'next'
      | 'search'
      | 'send'
      // Android-only
      | 'none'
      | 'previous'
      // iOS-only
      | 'default'
      | 'emergency-call'
      | 'google'
      | 'join'
      | 'route'
      | 'yahoo',
    /**
     * Sets the return key to the label. Use it instead of `returnKeyType`.
     * @platform android
     */
    returnKeyLabel?: string,
    /**
     * Limits the maximum number of characters that can be entered. Use this
     * instead of implementing the logic in JS to avoid flicker.
     */
    maxLength?: number,
    /**
     * Sets the number of lines for a `TextInput`. Use it with multiline set to
     * `true` to be able to fill the lines.
     * @platform android
     */
    numberOfLines?: number,
    /**
     * When `false`, if there is a small amount of space available around a text input
     * (e.g. landscape orientation on a phone), the OS may choose to have the user edit
     * the text inside of a full screen text input mode. When `true`, this feature is
     * disabled and users will always edit the text directly inside of the text input.
     * Defaults to `false`.
     * @platform android
     */
    disableFullscreenUI?: boolean,
    /**
     * If `true`, the keyboard disables the return key when there is no text and
     * automatically enables it when there is text. The default value is `false`.
     * @platform ios
     */
    enablesReturnKeyAutomatically?: boolean,
    /**
     * If `true`, the text input can be multiple lines.
     * The default value is `false`.
     */
    multiline?: boolean,
    /**
     * Set text break strategy on Android API Level 23+, possible values are `simple`, `highQuality`, `balanced`
     * The default value is `simple`.
     * @platform android
     */
    textBreakStrategy?: 'simple' | 'highQuality' | 'balanced',
    /**
     * Callback that is called when the text input is blurred.
     */
    onBlur?: Function,
    /**
     * Callback that is called when the text input is focused.
     */
    onFocus?: Function,
    /**
     * Callback that is called when the text input's text changes.
     */
    onChange?: Function,
    /**
     * Callback that is called when the text input's text changes.
     * Changed text is passed as an argument to the callback handler.
     */
    onChangeText?: Function,
    /**
     * Callback that is called when the text input's content size changes.
     * This will be called with
     * `{ nativeEvent: { contentSize: { width, height } } }`.
     *
     * Only called for multiline text inputs.
     */
    onContentSizeChange?: Function,
    /**
     * Callback that is called when text input ends.
     */
    onEndEditing?: Function,
    /**
     * Callback that is called when the text input selection is changed.
     * This will be called with
     * `{ nativeEvent: { selection: { start, end } } }`.
     */
    onSelectionChange?: Function,
    /**
     * Callback that is called when the text input's submit button is pressed.
     * Invalid if `multiline={true}` is specified.
     */
    onSubmitEditing?: Function,
    /**
     * Callback that is called when a key is pressed.
     * This will be called with `{ nativeEvent: { key: keyValue } }`
     * where `keyValue` is `'Enter'` or `'Backspace'` for respective keys and
     * the typed-in character otherwise including `' '` for space.
     * Fires before `onChange` callbacks.
     * @platform ios
     */
    onKeyPress?: Function,
    /**
     * Invoked on mount and layout changes with `{x, y, width, height}`.
     */
    onLayout?: Function,
    /**
     * Invoked on content scroll with `{ nativeEvent: { contentOffset: { x, y } } }`.
     * May also contain other properties from ScrollEvent but on Android contentSize
     * is not provided for performance reasons.
     */
    onScroll?: Function,
    /**
     * The string that will be rendered before text input has been entered.
     */
    placeholder?: Function,
    /**
     * The text color of the placeholder string.
     */
    placeholderTextColor?: Color,
    /**
     * If `true`, the text input obscures the text entered so that sensitive text
     * like passwords stay secure. The default value is `false`.
     */
    secureTextEntry?: boolean,
    /**
     * The highlight and cursor color of the text input.
     */
    selectionColor?: Color,
    /**
     * An instance of `DocumentSelectionState`, this is some state that is responsible for
     * maintaining selection information for a document.
     *
     * Some functionality that can be performed with this instance is:
     *
     * - `blur()`
     * - `focus()`
     * - `update()`
     *
     * > You can reference `DocumentSelectionState` in
     * > [`vendor/document/selection/DocumentSelectionState.js`](https://github.com/facebook/react-native/blob/master/Libraries/vendor/document/selection/DocumentSelectionState.js)
     *
     * @platform ios
     */
    selectionState?: DocumentSelectionState,
    /**
     * The start and end of the text input's selection. Set start and end to
     * the same value to position the cursor.
     */
    selection?: {
      start: number,
      end?: number,
    },
    /**
     * The value to show for the text input. `TextInput` is a controlled
     * component, which means the native value will be forced to match this
     * value prop if provided. For most uses, this works great, but in some
     * cases this may cause flickering - one common cause is preventing edits
     * by keeping value the same. In addition to simply setting the same value,
     * either set `editable={false}`, or set/update `maxLength` to prevent
     * unwanted edits without flicker.
     */
    value?: string,
    /**
     * Provides an initial value that will change when the user starts typing.
     * Useful for simple use-cases where you do not want to deal with listening
     * to events and updating the value prop to keep the controlled state in sync.
     */
    defaultValue?: string,
    /**
     * When the clear button should appear on the right side of the text view.
     * @platform ios
     */
    clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always',
    /**
     * If `true`, clears the text field automatically when editing begins.
     * @platform ios
     */
    clearTextOnFocus?: boolean,
    /**
     * If `true`, all text will automatically be selected on focus.
     */
    selectTextOnFocus?: boolean,
    /**
     * If `true`, the text field will blur when submitted.
     * The default value is true for single-line fields and false for
     * multiline fields. Note that for multiline fields, setting `blurOnSubmit`
     * to `true` means that pressing return will blur the field and trigger the
     * `onSubmitEditing` event instead of inserting a newline into the field.
     */
    blurOnSubmit?: boolean,
    /**
     * Note that not all Text styles are supported,
     * see [Issue#7070](https://github.com/facebook/react-native/issues/7070)
     * for more detail.
     *
     * [Styles](docs/style.html)
     */
    style?: StyleProp<TextStylePropTypes, StyleId>,
    /**
     * The color of the `TextInput` underline.
     * @platform android
     */
    underlineColorAndroid?: Color,

    /**
     * If defined, the provided image resource will be rendered on the left.
     * @platform android
     */
    inlineImageLeft?: string,

    /**
     * Padding between the inline image, if any, and the text input itself.
     * @platform android
     */
    inlineImagePadding?: number,

    /**
     * Determines the types of data converted to clickable URLs in the text input.
     * Only valid if `multiline={true}` and `editable={false}`.
     * By default no data types are detected.
     *
     * You can provide one type or an array of many types.
     *
     * Possible values for `dataDetectorTypes` are:
     *
     * - `'phoneNumber'`
     * - `'link'`
     * - `'address'`
     * - `'calendarEvent'`
     * - `'none'`
     * - `'all'`
     *
     * @platform ios
     */
    dataDetectorTypes?: DataDetector | Array<DataDetector>,
    /**
     * If `true`, caret is hidden. The default value is `false`.
     */
    caretHidden?: boolean,
  |};
  declare type SwitchProperties = {|
    ...ViewProperties,
    /**
     * Background color when the switch is turned on.
     *
     * @deprecated use trackColor instead
     */
    onTintColor?: string,

    /**
     * Color of the foreground switch grip.
     *
     * @deprecated use thumbColor instead
     */
    thumbTintColor?: string,

    /**
     * Background color when the switch is turned off.
     *
     * @deprecated use trackColor instead
     */
    tintColor?: string,

    /**
     * Color of the foreground switch grip.
     */
    thumbColor?: string,

    /**
     * Custom colors for the switch track
     *
     * Color when false and color when true
     */
    trackColor?: { false: string, true: string },

    /**
     * If true the user won't be able to toggle the switch.
     * Default value is false.
     */
    disabled?: boolean,

    /**
     * Invoked with the new value when the value changes.
     */
    onValueChange?: (value: boolean) => void,

    /**
     * Used to locate this view in end-to-end tests.
     */
    testID?: string,

    /**
     * The value of the switch. If true the switch will be turned on.
     * Default value is false.
     */
    value?: boolean,

    /**
     * On iOS, custom color for the background.
     * Can be seen when the switch value is false or when the switch is disabled.
     */
    ios_backgroundColor?: string,

    style?: StyleProp<ViewStyle>,
  |};

  declare type StyleProp<+T> =
    | null
    | void
    | T
    | false
    | ''
    | $ReadOnlyArray<StyleProp<T>>;

  declare type IconButtonProps = {|
    ...TouchableHighlightProps,
    ...TouchableNativeFeedbackProps,
    /**
     * Size of the icon, can also be passed as fontSize in the style object.
     *
     * @default 12
     */
    size?: number,

    /**
     * Name of the icon to show
     *
     * See Icon Explorer app
     * {@link https://github.com/oblador/react-native-vector-icons/tree/master/Examples/IconExplorer}
     */
    name: string,

    /**
     * Color of the icon
     *
     */
    color?: string,

    /**
     * Text and icon color
     * Use iconStyle or nest a Text component if you need different colors.
     *
     * @default 'white'
     */
    color?: string,

    /**
     * Border radius of the button
     * Set to 0 to disable.
     *
     * @default 5
     */
    borderRadius?: number,

    /**
     * Styles applied to the icon only
     * Good for setting margins or a different color.
     *
     * @default {marginRight: 10}
     */
    iconStyle?: TextStyle,

    /**
     * Style prop inherited from TextProps and TouchableWithoutFeedbackProperties
     * Only exist here so we can have ViewStyle or TextStyle
     *
     */
    style?: ViewStyle | TextStyle,

    /**
     * Background color of the button
     *
     * @default '#007AFF'
     */
    backgroundColor?: string,
  |};

  declare type IndicatorSize = number | 'small' | 'large';

  declare type ActivityIndicatorProperties = $ReadOnly<{|
    hidesWhenStopped?: ?boolean,

    animating?: ?boolean,
    color?: ?string,
    size?: ?IndicatorSize,
  |}>;

  declare type TouchableHighlightProps = $ReadOnly<{|
    ...TouchableWithoutFeedbackProps,
    nextFocusDown?: ?number,
    nextFocusForward?: ?number,
    nextFocusLeft?: ?number,
    nextFocusRight?: ?number,
    nextFocusUp?: ?number,

    hasTVPreferredFocus?: ?boolean,

    activeOpacity?: ?number,
    underlayColor?: ?ColorValue,
    style?: ?ViewStyleProp,
    onShowUnderlay?: ?() => void,
    onHideUnderlay?: ?() => void,
    testOnly_pressed?: ?boolean,

    hostRef?: React$Ref<typeof View>,
  |}>;

  declare type TouchableWithoutFeedbackProps = $ReadOnly<{|
    accessibilityActions?: ?$ReadOnlyArray<AccessibilityActionInfo>,
    accessibilityElementsHidden?: ?boolean,
    accessibilityHint?: ?Stringish,
    accessibilityIgnoresInvertColors?: ?boolean,
    accessibilityLabel?: ?Stringish,
    accessibilityLiveRegion?: ?('none' | 'polite' | 'assertive'),
    accessibilityRole?: ?AccessibilityRole,
    accessibilityState?: ?AccessibilityState,
    accessibilityValue?: ?AccessibilityValue,
    accessibilityViewIsModal?: ?boolean,
    accessible?: ?boolean,
    children?: ?React$Node,
    delayLongPress?: ?number,
    delayPressIn?: ?number,
    delayPressOut?: ?number,
    disabled?: ?boolean,
    focusable?: ?boolean,
    hitSlop?: ?EdgeInsetsProp,
    importantForAccessibility?: ?(
      | 'auto'
      | 'yes'
      | 'no'
      | 'no-hide-descendants'
    ),
    nativeID?: ?string,
    onAccessibilityAction?: ?(event: AccessibilityActionEvent) => mixed,
    onBlur?: ?(event: BlurEvent) => mixed,
    onFocus?: ?(event: FocusEvent) => mixed,
    onLayout?: ?(event: LayoutEvent) => mixed,
    onLongPress?: ?(event: PressEvent) => mixed,
    onPress?: ?(event: PressEvent) => mixed,
    onPressIn?: ?(event: PressEvent) => mixed,
    onPressOut?: ?(event: PressEvent) => mixed,
    pressRetentionOffset?: ?EdgeInsetsProp,
    rejectResponderTermination?: ?boolean,
    testID?: ?string,
    touchSoundDisabled?: ?boolean,
  |}>;

  declare type TouchableOpacityProps = $ReadOnly<{|
    ...TouchableWithoutFeedbackProps,
    hasTVPreferredFocus?: ?boolean,
    nextFocusDown?: ?number,
    nextFocusForward?: ?number,
    nextFocusLeft?: ?number,
    nextFocusRight?: ?number,
    nextFocusUp?: ?number,

    activeOpacity?: ?number,
    style?: ?ViewStyleProp,

    hostRef?: React$Ref<typeof Animated.View>,
  |}>;

  declare type TouchableNativeFeedbackProps = {|
    ...TouchableWithoutFeedbackProps,
    background?: ?(
      | $ReadOnly<{|
          type: 'ThemeAttrAndroid',
          attribute:
            | 'selectableItemBackground'
            | 'selectableItemBackgroundBorderless',
        |}>
      | $ReadOnly<{|
          type: 'RippleAndroid',
          color: ?number,
          borderless: boolean,
        |}>
    ),
    hasTVPreferredFocus?: ?boolean,
    nextFocusDown?: ?number,
    nextFocusForward?: ?number,
    nextFocusLeft?: ?number,
    nextFocusRight?: ?number,
    nextFocusUp?: ?number,
    useForeground?: ?boolean,
  |};

  declare type StatusBarProperties = $ReadOnly<{|
    backgroundColor?: ?string,
    translucent?: ?boolean,
    networkActivityIndicatorVisible?: ?boolean,
    showHideTransition?: ?('fade' | 'slide'),
    /**
     * If the status bar is hidden.
     */
    hidden?: ?boolean,
    /**
     * If the transition between status bar property changes should be animated.
     * Supported for backgroundColor, barStyle and hidden.
     */
    animated?: ?boolean,
    /**
     * Sets the color of the status bar text.
     */
    barStyle?: ?('default' | 'light-content' | 'dark-content'),
  |}>;

  /**
   * Supports auto complete for most used types as well as any other string type.
   */
  declare export type IconType =
    | 'material'
    | 'material-community'
    | 'simple-line-icon'
    | 'zocial'
    | 'font-awesome'
    | 'octicon'
    | 'ionicon'
    | 'foundation'
    | 'evilicon'
    | 'entypo'
    | 'antdesign'
    | 'font-awesome-5'
    | string;

  declare export type IconObject = {|
    name?: string,
    color?: string,
    size?: number,
    type?: IconType,
    style?: StyleProp<TextStyle>,
  |};

  declare export type AvatarIcon = {|
    ...IconObject,
    iconStyle?: StyleProp<TextStyle>,
  |};

  declare export type TextProps = {|
    ...TextProperties,
    /**
     * font size 40
     */
    h1?: boolean,

    /**
     * font size 34
     */
    h2?: boolean,

    /**
     * font size 28
     */
    h3?: boolean,

    /**
     * font size 22
     */
    h4?: boolean,

    /**
     * Styling for when `h1` is set
     */
    h1Style?: StyleProp<TextStyle>,

    /**
     * Styling for when `h2` is set
     */
    h2Style?: StyleProp<TextStyle>,

    /**
     * Styling for when `h3` is set
     */
    h3Style?: StyleProp<TextStyle>,

    /**
     * Styling for when `h4` is set
     */
    h4Style?: StyleProp<TextStyle>,

    /**
     * Additional styling for Text
     */
    style?: StyleProp<TextStyle>,
  |};

  /**
   * HTML Style Headings
   *
   */
  declare export class Text extends React$Component<TextProps, any> {}

  declare export type AvatarProps = {|
    /**
     * Component for enclosing element (eg: TouchableHighlight, View, etc)
     *
     * @default TouchableOpacity
     */
    Component?: React$AbstractComponent<any, any>,

    /**
     * Callback function when pressing Edit button
     */
    onAccessoryPress?: () => void,

    /**
     * Callback function when pressing component
     */
    onPress?: () => void,

    /**
     * Callback function when long pressing component
     */
    onLongPress?: () => void,

    /**
     * Styling for outer container
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Image source
     */
    source?: ImageSourcePropType,

    /**
     * Style for avatar image
     */
    avatarStyle?: ImageStyle,

    /**
     * Determines the shape of avatar
     *
     * @default false
     */
    rounded?: boolean,

    /**
     * Renders title in the avatar
     */
    title?: string,

    /**
     * Style for the title
     */
    titleStyle?: StyleProp<TextStyle>,

    /**
     * Style for the view outside image or icon
     */
    overlayContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Opacity when pressed
     *
     * @default 0.2
     */
    activeOpacity?: number,

    /**
     * If to show the edit button or not
     *
     * @default false
     */
    showAccessory?: boolean,

    /**
     * Edit button for the avatar
     *
     * @default "{size: null, iconName: 'mode-edit', iconType: 'material', iconColor: '#fff', underlayColor: '#000', style: null}"
     */
    accessory?: $Shape<IconProps> & $Shape<ImageProps>,

    /**
     * Style for the placeholder
     */
    placeholderStyle?: StyleProp<ViewStyle>,

    /**
     * Render a content inside placeholder
     */
    renderPlaceholderContent?: React$Node,

    /**
     * Icon for the avatar
     */
    icon?: AvatarIcon,

    /**
     * extra styling for icon component
     */
    iconStyle?: StyleProp<TextStyle>,

    /**
     * Optional properties to pass to the image if provided e.g "resizeMode"
     */
    imageProps?: $Shape<ImageProps>,

    /**
     * Size of Avatar
     * @default "small"
     */

    size?: 'small' | 'medium' | 'large' | 'xlarge' | number,

    /**
     * Image Component of Avatar
     * @default React Native default Image component
     */

    ImageComponent?: React$AbstractComponent<any, any>,
  |};

  /**
   * Avatar Component
   *
   */
  declare export class Avatar extends React$Component<AvatarProps> {}

  declare export type ButtonProps = {|
    ...TouchableOpacityProps,
    ...TouchableNativeFeedbackProps,
    /**
     * Specify other touchable such as TouchableOpacity/TouchableNativeFeedback
     *
     * Default is TouchableOpacity on IOS and TouchableNativeFeedback on Android
     */
    TouchableComponent?: React$AbstractComponent<any, any>,

    /**
     * Specify a different component as the background for the button.
     * Useful for if you want to make a button with a gradient background.
     *
     * @default View
     */
    ViewComponent?: React$AbstractComponent<any, any>,

    /**
     * Additional styling for button (background) view component
     *
     * @default null
     */
    buttonStyle?: StyleProp<ViewStyle>,

    /**
     * Button title
     */
    title?: string,

    /**
     * If to show the icon on the right
     *
     * @default false
     */
    iconRight?: boolean,

    /**
     * Icon to show in the button
     */
    icon?: IconNode,

    /**
     * Style for the container around the icon
     */
    iconContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Title styling
     */
    titleStyle?: StyleProp<TextStyle>,

    /**
     * Optional props for the title inside the button
     */
    titleProps?: TextProperties,

    /**
     * Styling for Component container
     *
     * @default null
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Display a loading spinner
     *
     * @default false
     */
    loading?: boolean,

    /**
     * Additional style to applied to the ActivityIndicator
     */
    loadingStyle?: StyleProp<ViewStyle>,

    /**
     * Additional props to applied to the ActivityIndicator
     */
    loadingProps?: ActivityIndicatorProperties,

    /**
     * Object of props to be applied to the linearGradient view(ViewComponent)
     */
    linearGradientProps?: Object,

    /**
     * Type of button
     *
     * @default solid
     */
    type?: 'solid' | 'clear' | 'outline',

    /**
     * If the user is allowed to interact with the button
     *
     * @default false
     */
    disabled?: boolean,

    /**
     * Style of the title when the button is disabled
     */
    disabledTitleStyle?: StyleProp<TextStyle>,

    /**
     * Style of the button when disabled
     */
    disabledStyle?: StyleProp<ViewStyle>,

    /**
     * If the button has raised styling
     *
     * @default false
     */
    raised?: boolean,
  |};

  /**
   * Button component
   *
   */
  declare export class Button extends React$Component<ButtonProps, any> {}

  declare export type BadgeProps = {|
    /**
     * Text value to be displayed by badge
     *
     * @default null
     */
    value?: React$Node,

    /**
     * Additional styling for badge (background) view component
     */
    badgeStyle?: StyleProp<ViewStyle>,

    /**
     * Style for the container
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Style for the text in the badge
     */
    textStyle?: StyleProp<TextStyle>,

    /**
     * Custom component to replace the badge component
     *
     * @default View (if onPress then TouchableOpacity)
     */
    Component?: React$AbstractComponent<any, any>,

    /**
     * Determines color of the indicator
     *
     * @default primary
     */
    status?: 'primary' | 'success' | 'warning' | 'error',

    /**
     * Function called when pressed on the badge
     */
    onPress?: () => void,
  |};

  /**
   * Badge component
   *
   */
  declare export class Badge extends React$Component<BadgeProps> {}

  /**
   * withBadge Higher-Order Component
   *
   * @param value
   * @param options
   */
  declare export function withBadge(
    /**
     * Text value to be displayed by badge
     */
    value?: React$Node | (() => React$Node),
    /**
     * Options to configure the badge
     */
    options?: {
      bottom?: number,
      left?: number,
      right?: number,
      top?: number,
      hidden?: boolean,
      containerStyle?: StyleProp<ViewStyle>,
    } & BadgeProps,
  ): <P = {}>(
    WrappedComponent: React$ComponentType<P>,
  ) => React$ComponentType<P>;

  declare export type CardProps = {|
    /**
     * Outer container style
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Inner container style
     */
    wrapperStyle?: StyleProp<ViewStyle>,

    /**
     * Card title
     */
    title?: string | React$Node,

    /**
     * Additional title styling (if title provided)
     */
    titleStyle?: StyleProp<TextStyle>,

    /**
     * Title rendered over the image
     * (only works if image prop is present)
     */
    featuredTitle?: string,

    /**
     * Styling for featured title
     */
    featuredTitleStyle?: StyleProp<TextStyle>,

    /**
     * Subtitle rendered over the image
     * (only works if image prop is present)
     */
    featuredSubtitle?: string,

    /**
     * Styling for featured subtitle
     */
    featuredSubtitleStyle?: StyleProp<TextStyle>,

    /**
     * Additional divider styling
     * (if title provided)
     */
    dividerStyle?: StyleProp<ViewStyle>,

    /**
     * Specify image styling if image is provided
     */
    imageStyle?: ImageStyle,

    /**
     * Specify styling for view surrounding image
     */
    imageWrapperStyle?: StyleProp<ViewStyle>,

    /**
     * Add an image as the heading with the image prop
     */
    image?: ImageSourcePropType,

    /**
     * Optional properties to pass to the image if provided e.g "resizeMode"
     */
    imageProps?: $Shape<ImageProps>,
  |};

  /**
   * Card component
   *
   */
  declare export class Card extends React$Component<CardProps> {}

  /**
   * Set the buttons within a Group.
   */
  declare export type ElementObject = {|
    element: React$Node | React$ElementType<any>,
  |};

  /**
   * Set the border styles for a component.
   */
  declare export type InnerBorderStyleProperty = {|
    color?: string,
    width?: number,
  |};

  declare export type ButtonGroupProps = {|
    /**
     * Allows the user to select multiple items
     *
     * @default false
     */
    selectMultiple?: boolean,

    /**
     * Current selected index of array of buttons
     */
    selectedIndex?: number | null,

    /**
     * The indexes that are selected. Used with 'selectMultiple'
     *
     * @default []
     */
    selectedIndexes?: number[],

    /**
     * Array of buttons for component, if returning a component, must be an object with { element: componentName }
     */
    buttons: string[] | ElementObject[],

    /**
     * Choose other button component such as TouchableOpacity
     *
     * @default TouchableHighlight
     */
    Component?: React$ComponentType<any>,

    /**
     * Specify styling for main button container
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * inherited styling	specify styling for button
     */
    buttonStyle?: StyleProp<ViewStyle>,

    /**
     * Specify styling selected button
     *
     * @default 'white'
     */
    selectedButtonStyle?: StyleProp<ViewStyle>,

    /**
     * Specify specific styling for text
     */
    textStyle?: StyleProp<TextStyle>,

    /**
     * Specify specific styling for text in the selected state
     */
    selectedTextStyle?: StyleProp<TextStyle>,

    /**
     * inherited styling	object { width, color }	update the styling of the interior border of the list of buttons
     */
    innerBorderStyle?: InnerBorderStyleProperty,

    /**
     * Specify underlayColor for TouchableHighlight
     *
     * @default 'white'
     */
    underlayColor?: string,

    /**
     * Determines what the opacity of the wrapped view should be when touch is active.
     */
    activeOpacity?: number,

    /**
     * Border radius for the container
     */
    containerBorderRadius?: number,

    /**
     * Controls if buttons are disabled
     *
     * Setting `true` makes all of them disabled, while using an array only makes those indices disabled
     *
     * @default false
     */
    disabled?: boolean | number[],

    /**
     * Styling for each button when disabled
     */
    disabledStyle?: StyleProp<ViewStyle>,

    /**
     * Styling for each selected button when disabled
     */
    disabledSelectedStyle?: StyleProp<ViewStyle>,

    /**
     * Styling for the text of each button when disabled
     */
    disabledTextStyle?: StyleProp<TextStyle>,

    /**
     * Styling for the text of each selected button when disabled
     */
    disabledSelectedTextStyle?: StyleProp<TextStyle>,

    /**
     * Display in vertical orientation
     *
     * @default false
     */
    vertical?: boolean,

    /**
     * Method to update Button Group Index
     */
    onPress(selectedIndex: number): void,

    /**
     *
     * Called immediately after the underlay is hidden
     */
    onHideUnderlay?: () => void,

    /**
     * Called immediately after the underlay is shown
     */
    onShowUnderlay?: () => void,

    /**
     * Animate the touchable to a new opacity.
     */
    setOpacityTo?: (value: number) => void,
  |};

  declare export class ButtonGroup extends React$Component<ButtonGroupProps> {}

  declare export type CheckBoxProps = {|
    /**
     * Icon family, can be one of the following
     * (required only if specifying an icon that is not from font-awesome)
     */
    iconType?: IconType,

    /**
     *  Specify React Native component for main button
     */
    Component?: React$AbstractComponent<any, any>,

    /**
     * Flag for checking the icon
     *
     * @default false
     */
    checked: boolean,

    /**
     * Moves icon to right of text.
     *
     * @default false
     */
    iconRight?: boolean,

    /**
     * Aligns checkbox to right
     *
     * @default false
     */
    right?: boolean,

    /**
     * Aligns checkbox to center
     *
     *  @default false
     */
    center?: boolean,

    /**
     * Title of checkbox
     */
    title?: string | React$Node,

    /**
     * Additional props for the title
     */
    titleProps?: $Shape<TextProperties>,

    /**
     * Style of main container
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Style of container that wraps the check box and text
     */
    wrapperStyle?: StyleProp<ViewStyle>,

    /**
     * style of text
     */
    textStyle?: StyleProp<TextStyle>,

    /**
     * Size of the checkbox
     *
     * @default 24
     */
    size?: number,

    /**
     * onLongPress function for checkbox
     */
    onLongPress?: () => void,

    /**
     * onLongPress function for checkbox
     */
    onLongIconPress?: () => void,

    /**
     * onPress function for container
     */
    onPress?: () => void,

    /**
     * onPress function for checkbox
     */
    onIconPress?: () => void,

    /**
     * Default checked icon (Font Awesome Icon)
     *
     * @default 'check-square-o'
     */
    checkedIcon?: string | React$Node,

    /**
     * Default checked icon (Font Awesome Icon)
     *
     * @default 'square-o'
     */
    uncheckedIcon?: string | React$Node,

    /**
     * Default checked color
     *
     * @default 'green'
     */
    checkedColor?: string,

    /**
     * Default unchecked color
     * @default '#bfbfbf'
     */
    uncheckedColor?: string,

    /**
     * Specify a custom checked message
     */
    checkedTitle?: string,

    /**
     * Specify different font family
     * @default 'System font bold (iOS)'
     * @default 'Sans Serif Bold (android)'
     */
    fontFamily?: string,
  |};

  declare export class CheckBox extends React$Component<CheckBoxProps, any> {}

  declare export type DividerProps = { ...ViewProperties };

  declare export class Divider extends React$Component<DividerProps> {}

  declare export type InputProps = {|
    ...TextInputProps,
    /**
     * Styling for Input Component Container (optional)
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Disables the input field
     */
    disabled?: boolean,

    /**
     * Style of the input field when disabled
     */
    disabledInputStyle?: StyleProp<TextStyle>,

    /**
     * Styling for Input Component Container (optional)
     */
    inputContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Displays an icon to the left (optional)
     */
    leftIcon?: IconNode,

    /**
     * Styling for left Icon Component container
     */
    leftIconContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Displays an icon to the right (optional)
     */
    rightIcon?: IconNode,

    /**
     * Styling for the right icon container
     */
    rightIconContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Renders component in place of the React Native `TextInput` (optional)
     */
    InputComponent?: React$ComponentType<any>,

    /**
     * 	Adds styling to input component (optional)
     */
    inputStyle?: StyleProp<TextStyle>,

    /**
     * 	Add styling to error message (optional)
     */
    errorStyle?: StyleProp<TextStyle>,

    /**
     * 	Adds error message (optional)
     */
    errorMessage?: string,

    /**
     * 	props to be passed to the React Native Text component used to display the error message (optional)
     */
    errorProps?: TextProps,

    /**
     * 	Add styling to label (optional)
     */
    labelStyle?: StyleProp<TextStyle>,

    /**
     * 	Adds label (optional)
     */
    label?: string | React$Node,

    /**
     *  props to be passed to the React Native Text component used to display the label (optional)
     */
    labelProps?: TextProps,
  |};

  declare export class Input extends React$Component<InputProps> {
    /**
     * Shakes the Input
     *
     * eg `this.inputRef.shake()`
     */
    shake: () => void;

    /**
     * Calls focus on the Input
     *
     * eg `this.inputRef.focus()`
     */
    focus: () => void;

    /**
     * Calls isFocused() on the Input
     *
     * eg `let focused = this.inputRef.isFocused()`
     */
    isFocused(): boolean;

    /**
     * Calls blur on the Input
     *
     * eg `this.inputRef.blur()`
     */
    blur: () => void;

    /**
     * Calls clear on the Input
     *
     * eg `this.inputRef.clear()`
     */
    clear: () => void;

    /**
     * Calls setNativeProps on the Input
     *
     * eg `this.inputRef.setNativeProps({ text: 'any text' })`
     */
    setNativeProps(nativeProps: $Shape<TextInputProps>): void;
  }

  declare export type HeaderIcon = {|
    ...IconObject,
    icon?: string,
    text?: string,
    color?: string,
    style?: StyleProp<TextStyle>,
  |};

  /**
   * Defines the types that can be used in a header sub component
   */
  declare export type HeaderSubComponent = React$Node | TextProps | HeaderIcon;

  declare export type HeaderProps = {
    ...ViewProperties,
    /**
     * Specify a different component as the background for the button.
     * Useful for if you want to make a button with a gradient background.
     *
     * @default View
     */
    ViewComponent?: React$AbstractComponent<any, any>,

    /**
     * Object of props to be applied to the linearGradient view(ViewComponent)
     */
    linearGradientProps?: Object,

    /**
     * Accepts all props for StatusBar
     */
    statusBarProps?: StatusBarProperties,

    /**
     * Sets the color of the status bar text.
     *
     * @default 'default'
     */
    barStyle?: StatusBarStyle,

    /**
     * Configuration object for default component (icon: string, ...props for React Native Elements Icon) or a valid React Element	define your left component here
     */
    leftComponent?: HeaderSubComponent,

    /**
     * Configuration object for default component (text: string, ...props for React Native Text component) valid React Element	define your center component here
     */
    centerComponent?: HeaderSubComponent,

    /**
     * Configuration object for default component (icon: string, ...props for React Native Elements Icon component) or a valid React Element	define your right component here
     */
    rightComponent?: HeaderSubComponent,

    /**
     * Sets backgroundColor of the parent component
     */
    backgroundColor?: string,

    /**
     * Background image source
     */
    backgroundImage?: ImageSourcePropType,

    /**
     * Styles for the background image in the container
     */
    backgroundImageStyle?: ImageStyle,

    /**
     * Determines the alignment of the title
     *
     * @default 'center'
     */
    placement?: 'left' | 'center' | 'right',

    /**
     * Styling for main container
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Styles for the container surrounding the title
     */
    centerContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Styling for container around the leftComponent
     */
    leftContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Styling for container around the rightComponent
     */
    rightContainerStyle?: StyleProp<ViewStyle>,
  };

  /**
   * Header component
   */
  declare export class Header extends React$Component<HeaderProps, any> {}

  declare export type IconProps = {|
    ...IconButtonProps,
    /**
     * Type (defaults to material, options are material-community, zocial, font-awesome, octicon, ionicon, foundation, evilicon, simple-line-icon, or entypo)
     * @default 'material'
     */
    type?: IconType,

    /**
     * View if no onPress method is defined, TouchableHighlight if onPress method is defined	React Native component	update React Native Component
     */
    Component?: React$AbstractComponent<any, any>,

    /**
     * Reverses color scheme
     *
     * @default false
     */
    reverse?: boolean,

    /**
     * Adds box shadow to button
     *
     * @default false
     */
    raised?: boolean,

    /**
     * Add styling to container holding icon
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Specify reverse icon color
     *
     * @default 'white'
     */
    reverseColor?: string,

    /**
     * Styles for the Icon when disabled
     */
    disabledStyle?: StyleProp<ViewStyle>,

    /**
     * FontAwesome5 solid style
     *
     * @default false
     */
    solid?: boolean,

    /**
     * FontAwesome5 brands icon set
     *
     * @default false
     */
    brand?: boolean,
  |};

  /**
   * Icon component
   */
  declare export class Icon extends React$Component<IconProps> {}

  declare export type ScaleProps = {|
    ...TouchableWithoutFeedbackProps,
    style?: StyleProp<ViewStyle>,
    defaultNumber?: number,
    activeScale?: number,
    tension?: number,
    friction?: number,
    pressInTension?: number,
    pressInFriction?: number,
    pressOutTension?: number,
    pressOutFriction?: number,
    useNativeDriver?: boolean,
  |};

  declare export type ListItemProps = {|
    ...TouchableHighlightProps,
    containerStyle?: StyleProp<ViewStyle>,
    contentContainerStyle?: StyleProp<ViewStyle>,
    rightContentContainerStyle?: StyleProp<ViewStyle>,
    chevron?: boolean | $Shape<IconProps> | React$Node,
    checkmark?: boolean | $Shape<IconProps> | React$Node,
    title?: string | React$Node,
    titleStyle?: StyleProp<TextStyle>,
    titleProps?: TextProperties,
    subtitle?: string | React$Node,
    subtitleStyle?: StyleProp<TextStyle>,
    subtitleProps?: TextProperties,
    rightTitle?: string | React$Node,
    rightTitleStyle?: StyleProp<TextStyle>,
    rightTitleProps?: TextProperties,
    rightSubtitle?: string | React$Node,
    rightSubtitleStyle?: StyleProp<TextStyle>,
    rightSubtitleProps?: TextProperties,
    leftIcon?: $Shape<IconProps> | React$Node,
    rightIcon?: $Shape<IconProps> | React$Node,
    leftAvatar?: $Shape<AvatarProps> | React$Node,
    rightAvatar?: $Shape<AvatarProps> | React$Node,
    leftElement?: React$Node,
    rightElement?: React$Node,
    switch?: SwitchProperties,
    input?: InputProps,
    buttonGroup?: ButtonGroupProps,
    checkBox?: CheckBoxProps,
    badge?: BadgeProps,
    disabledStyle?: StyleProp<ViewStyle>,
    topDivider?: boolean,
    bottomDivider?: boolean,
    scaleProps?: ScaleProps,
    pad?: number,
    Component?: React$ComponentType<{}>,
    ViewComponent?: React$ComponentType<{}>,

    /**
     * onPress method
     */
    onPress?: () => void,

    /**
     * @default none	function	onLongPress method
     */
    onLongPress?: () => void,
  |};

  /**
   * ListItem component
   */
  declare export class ListItem extends React$Component<ListItemProps, any> {}

  declare export type OverlayProps = {|
    ...ModalProps,
    /**
     * Content of the overlay
     */
    children: React$Node,

    /**
     * If true, the overlay is visible
     */
    isVisible: boolean,

    /**
     * Style for the backdrop
     */
    backdropStyle?: StyleProp<ViewStyle>,

    /**
     * Style of the actual overlay
     */
    overlayStyle?: StyleProp<ViewStyle>,

    /**
     * If to take up full screen width and height
     *
     * @default false
     */
    fullScreen?: boolean,

    /**
     *  Override React Native `Modal` component (usable for web-platform)
     */
    ModalComponent?: React$AbstractComponent<any, any>,

    /**
     * Callback when user touches the backdrop
     */
    onBackdropPress?: () => void,
  |};

  declare export class Overlay extends React$Component<OverlayProps> {}

  declare export type ButtonInformation = {|
    title: string,
    icon: string,
    buttonStyle?: StyleProp<ViewStyle>,
    titleStyle?: StyleProp<TextStyle>,
  |};

  declare export type PricingCardProps = {|
    /**
     * Title
     */
    title?: string,

    /**
     * Price
     */
    price: string,

    /**
     * Color scheme for button & title
     */
    color?: string,

    /**
     * Pricing information
     */
    info?: string[],

    /**
     * {title, icon, buttonStyle}
     * Button information
     */
    button: ButtonInformation,

    /**
     * Function to be run when button is pressed
     */
    onButtonPress?: () => void,

    /**
     * Outer component styling
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Inner wrapper component styling
     */
    wrapperStyle?: StyleProp<ViewStyle>,

    /**
     * component title style
     */
    titleStyle?: StyleProp<TextStyle>,

    /**
     * component pricing text style
     */
    pricingStyle?: StyleProp<TextStyle>,

    /**
     * component info text style
     */
    infoStyle?: StyleProp<TextStyle>,
  |};

  /**
   * PricingCard component
   */
  declare export class PricingCard extends React$Component<
    PricingCardProps,
    any,
  > {}

  declare export type IconNode = boolean | React$Node | $Shape<IconProps>;

  declare export type SearchBarWrapper = {|
    /**
     * What style of search bar to display
     *
     * @default is 'default
     */
    platform?: 'default' | 'ios' | 'android',
  |};

  declare export type SearchBarBase = {|
    ...TextInputProps,
    /**
     * Styling for the searchbar container
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Optional styling for the TextInput's container
     */
    inputContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Override the clear Icon props or use a custom component. Use null or false to hide the icon.
     */
    clearIcon?: IconNode,

    /**
     * Override the search Icon props or use a custom component. Use null or false to hide the icon.
     */
    searchIcon?: IconNode,

    /**
     * TextInput styling
     */
    inputStyle?: StyleProp<TextStyle>,

    /**
     * Optional props to pass to the ActivityIndicator
     */
    loadingProps?: ActivityIndicatorProperties,

    /**
     * If to show the loading indicator
     *
     * @default false
     */
    showLoading?: boolean,

    /**
     * Container style for the left icon
     */
    leftIconContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Container style for the right icon
     */
    rightIconContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Callback fired when the clear button is pressed
     */
    onClear?: () => void,

    /**
     * Callback fired when the input is focused
     */
    onFocus?: () => void,

    /**
     * Callback fired when the input is blurred via the keyboard
     */
    onBlur?: () => void,

    /**
     * Method to fire when text is changed
     */
    onChangeText?: (text: string) => void,
  |};

  declare export type TooltipProps = {|
    /**
     * sets backgroundColor of the tooltip and pointer.
     */
    backgroundColor?: string,

    /**
     * Color to highlight the item the tooltip is surrounding.
     */
    highlightColor?: string,

    /**
     *  Override React Native `Modal` component (usable for web-platform)
     */
    ModalComponent?: React$AbstractComponent<any, any>,

    /**
     * function which gets called on closing the tooltip.
     */
    onClose?: () => void,

    /**
     * function which gets called on opening the tooltip.
     */
    onOpen?: () => void,

    /**
     * Color of tooltip pointer, it defaults to the backgroundColor if none passed .
     */
    pointerColor?: string,

    /**
     * Flag to determine to toggle or not the tooltip on press.
     */
    toggleOnPress?: boolean,

    /**
     * Component to be rendered as the display container.
     */
    popover?: React$Node,

    /**
     * Passes style object to tooltip container
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Tooltip container height. Necessary in order to render the container in the correct place. Pass height according to the size of the content rendered inside the container.
     * @default 40
     */
    height?: number,

    /**
     * Tooltip container width. Necessary in order to render the container in the correct place. Pass height according to the size of the content rendered inside the container.
     * @default 150
     */
    width?: number,

    /**
     *  Flag to determine whether or not dislay overlay shadow when tooltip is open.
     *
     * @default true
     */
    withOverlay?: boolean,

    /**
     *  Color of overlay shadow when tooltip is open.
     *
     * @default 'rgba(250, 250, 250, 0.70)'
     */
    overlayColor?: string,

    /**
     * Flag to determine whether or not dislay pointer.
     */
    withPointer?: boolean,

    /**
     * Force skip StatusBar height when calculating yOffset of element position (usable inside Modal on Android)
     */
    skipAndroidStatusBar?: boolean,
  |};

  declare export class Tooltip extends React$Component<TooltipProps, any> {
    /**
     * Toggles tooltip manually.
     */
    toggleTooltip: () => void;
  }

  declare export type SearchBarDefault = {|
    ...SearchBarBase,
    /**
     * Change theme to light theme
     *
     * @default false
     */
    lightTheme?: boolean,

    /**
     * Change TextInput styling to rounded corners
     *
     * @default false
     */
    round?: boolean,
  |};

  declare export type SearchBarPlatform = {|
    ...SearchBarBase,
    /**
     * Callback fired when the cancel button is pressed
     */
    onCancel?: () => void,
  |};

  declare export type SearchBarAndroid = {|
    ...SearchBarPlatform,
    /**
     * Override the cancel Icon props or use a custom component. Use null or false to hide the icon.
     */
    cancelIcon?: IconNode,
  |};

  declare export type SearchBarIOS = {|
    ...SearchBarPlatform,
    /**
     * Props passed to cancel button
     */
    cancelButtonProps?: $Shape<TouchableOpacityProps> & {
      buttonStyle?: StyleProp<ViewStyle>,
      buttonTextStyle?: StyleProp<TextStyle>,
      color?: string,
      buttonDisabledStyle?: StyleProp<ViewStyle>,
      buttonDisabledTextStyle?: StyleProp<ViewStyle>,
    },

    /**
     * title of cancel button on iOS.  Default: 'Cancel'.
     */
    cancelButtonTitle?: string,

    /**
     * When `true` the cancel button will stay visible after blur events.
     */
    showCancel?: boolean,
  |};

  declare export type SearchBarProps = SearchBarWrapper &
    SearchBarBase &
    SearchBarPlatform &
    SearchBarDefault &
    SearchBarIOS &
    SearchBarAndroid;

  /**
   * SearchBar component
   */
  declare export class SearchBar extends React$Component<SearchBarProps, any> {
    /**
     * Holds reference to the stored input.
     */
    input: TextInput;

    /**
     * Call focus on the TextInput
     */
    focus: () => void;

    /**
     * Call blur on the TextInput
     */
    blur: () => void;

    /**
     * Call clear on the TextInput
     */
    clear: () => void;

    /**
     * Only available for Android and IOS
     * call blur on the TextInput
     * call cancel passed from Props
     */
    cancel?: () => void;
  }

  declare export type SliderProps = {|
    /**
     * Initial value of the slider
     *
     * @default 0
     */
    value?: number,

    /**
     * Choose the orientation
     *
     * @default horizontal
     */
    orientation?: 'horizontal' | 'vertical',

    /**
     * If true the user won't be able to move the slider
     *
     * @default false
     */
    disabled?: boolean,

    /**
     * Initial minimum value of the slider
     *
     * @default	0
     */
    minimumValue?: number,

    /**
     * Initial maximum value of the slider
     *
     * @default 1
     */
    maximumValue?: number,

    /**
     * Step value of the slider. The value should be between 0 and maximumValue - minimumValue)
     *
     * @default 0
     */
    step?: number,

    /**
     * The color used for the track to the left of the button
     *
     * @default '#3f3f3f'
     */
    minimumTrackTintColor?: string,

    /**
     * The color used for the track to the right of the button
     *
     * @default '#b3b3b3'
     */
    maximumTrackTintColor?: string,

    /**
     * The color used for the thumb
     *
     * @default '#343434'
     */
    thumbTintColor?: string,

    /**
     * The size of the touch area that allows moving the thumb. The touch area has the same center as the visible thumb.
     * This allows to have a visually small thumb while still allowing the user to move it easily.
     *
     * @default "{width: 40, height: 40}"
     */
    thumbTouchSize?: {
      width?: number,
      height?: number,
    },

    /**
     * Callback continuously called while the user is dragging the slider
     */
    onValueChange?: (value: number) => void,

    /**
     * Callback called when the user starts changing the value (e.g. when the slider is pressed)
     */
    onSlidingStart?: (value: number) => void,

    /**
     * Callback called when the user finishes changing the value (e.g. when the slider is released)
     */
    onSlidingComplete?: (value: number) => void,

    /**
     * The style applied to the slider container
     */
    style?: StyleProp<ViewStyle>,

    /**
     * The style applied to the track
     */
    trackStyle?: StyleProp<ViewStyle>,

    /**
     * The style applied to the thumb
     */
    thumbStyle?: StyleProp<ViewStyle>,

    /**
     * Set this to true to visually see the thumb touch rect in green.
     *
     * @default false
     */
    debugTouchArea?: boolean,

    /**
     * Set to true if you want to use the default 'spring' animation
     *
     * @default false
     */
    animateTransitions?: boolean,

    /**
     * Set to 'spring' or 'timing' to use one of those two types of animations with the default animation properties.
     *
     * @default 'timing'
     */
    animationType?: 'spring' | 'timing',

    /**
     * Used to configure the animation parameters. These are the same parameters in the Animated library.
     *
     * @default undefined
     */
    animationConfig?:
      | Animated.TimingAnimationConfig
      | Animated.SpringAnimationConfig,
  |};

  /**
   * Slider component
   */
  declare export class Slider extends React$Component<SliderProps, any> {}

  declare export type SocialMediaType =
    | 'facebook'
    | 'twitter'
    | 'google-plus-official'
    | 'google'
    | 'pinterest'
    | 'linkedin'
    | 'youtube'
    | 'vimeo'
    | 'tumblr'
    | 'instagram'
    | 'quora'
    | 'flickr'
    | 'foursquare'
    | 'wordpress'
    | 'stumbleupon'
    | 'github'
    | 'github-alt'
    | 'twitch'
    | 'medium'
    | 'soundcloud'
    | 'gitlab'
    | 'angellist'
    | 'codepen'
    | 'weibo'
    | 'vk';

  declare export type SocialIconProps = {|
    /**
     * Title if made into a button
     */
    title?: string,

    /**
     * Social media type
     */
    type: SocialMediaType,

    /**
     * Adds a drop shadow, set to false to remove
     *
     * @default true
     */
    raised?: boolean,

    /**
     * Creates button
     *
     * @default false
     */
    button?: boolean,

    /**
     * onPress method
     */
    onPress?: () => void,

    /**
     * @default none	function	onLongPress method
     */
    onLongPress?: () => void,

    /**
     * Reverses icon color scheme, setting background to white and icon to primary color
     *
     * @default false
     */
    light?: boolean,

    /**
     * Extra styling for icon component
     */
    iconStyle?: StyleProp<ViewStyle>,

    /**
     * Button styling
     */
    style?: StyleProp<ViewStyle>,

    /**
     * Icon color
     */
    iconColor?: string,

    /**
     * Icon size
     *
     * @default 24
     */
    iconSize?: number,

    /**
     * Component Type of button
     *
     * @default TouchableHighlight
     */
    Component?: React$AbstractComponent<any, any>,

    /**
     * Specify different font family
     *
     * @default System font bold (iOS), Sans Serif Black (android)
     */
    fontFamily?: string,

    /**
     * Specify font weight of title if set as a button with a title
     *
     * @default bold (ios), black(android)
     */
    fontWeight?: string,

    /**
     * Specify text styling
     */
    fontStyle?: StyleProp<TextStyle>,

    /**
     * Disable button
     *
     * @default false
     */
    disabled?: boolean,

    /**
     * Shows loading indicator
     *
     * @default false
     */
    loading?: boolean,

    /**
     * Specify underlayColor for TouchableHighlight
     *
     * @default 'white' if `light` prop is true, otherwise defaults to icon color.
     */
    underlayColor?: string,
  |};

  /**
   * SocialIcon component
   */
  declare export class SocialIcon extends React$Component<
    SocialIconProps,
    any,
  > {}

  declare export type TileProps = {|
    /**
     * Icon Component Props
     */
    icon?: IconObject,

    /**
     * Styling for the outer icon container
     */
    iconContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Text inside the tile
     */
    title?: string,

    /**
     * Styling for the title
     */
    titleStyle?: StyleProp<TextStyle>,

    /**
     * Text inside the tile when tile is featured
     */
    caption?: string,

    /**
     * Styling for the caption
     */
    captionStyle?: StyleProp<TextStyle>,

    /**
     * Changes the look of the tile
     */
    featured?: boolean,

    /**
     * @default none	object (style)	Styling for the outer tile container
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Source for the image
     */
    imageSrc: ImageURISource | string | number,

    /**
     * Styling for the image
     */
    imageContainerStyle?: StyleProp<ViewStyle>,
    /**
     * Styling for overlay
     */
    overlayContainerStyle?: StyleProp<ViewStyle>,
    /**
     * @default none	function (event)	Function to call when tile is pressed
     */
    onPress?: () => void,

    /**
     * Number passed to control opacity on press
     *
     * @default 0.2
     */
    activeOpacity?: number,

    /**
     * Styling for bottom container when not featured tile
     */
    contentContainerStyle?: StyleProp<ViewStyle>,

    /**
     * Width for the tile
     *
     * @default Device Width
     */
    width?: number,

    /**
     * Height for the tile
     *
     * @default Device Width * 0.8
     */
    height?: number,

    /**
     * Specify a different component as the Image component
     * @default React Native BackgroundImage component
     */
    ImageComponent?: React$AbstractComponent<any, any>,

    /**
     * Optional properties to pass to the image if provided e.g "resizeMode"
     */
    imageProps?: $Shape<ImageProps>,
  |};

  /**
   * Tile component
   */
  declare export class Tile extends React$Component<TileProps> {}

  declare export type ImageProps = {
    ...RNImageProps,
    /**
     * Specify a different component as the Image component.
     *
     * @default Image
     */
    ImageComponent?: React$ComponentType<any>,

    /**
     * Content to render when image is loading
     */
    PlaceholderContent?: React$Node,

    /**
     * Additional styling for the container
     */
    containerStyle?: StyleProp<ViewStyle>,

    /**
     * Additional styling for the placeholder container
     */
    placeholderStyle?: StyleProp<ViewStyle>,

    /**
     * Perform fade transition on image load
     *
     * @default true
     */
    transition?: boolean,
  };

  /**
   * Image component
   */
  declare export class Image extends React$Component<ImageProps> {}

  /**
   * Colors
   */

  declare export type Colors = {|
    primary: $ReadOnly<string>,
    secondary: $ReadOnly<string>,
    grey0: $ReadOnly<string>,
    grey1: $ReadOnly<string>,
    grey2: $ReadOnly<string>,
    grey3: $ReadOnly<string>,
    grey4: $ReadOnly<string>,
    grey5: $ReadOnly<string>,
    greyOutline: $ReadOnly<string>,
    searchBg: $ReadOnly<string>,
    success: $ReadOnly<string>,
    warning: $ReadOnly<string>,
    error: $ReadOnly<string>,
    disabled: $ReadOnly<string>,
    divider: $ReadOnly<string>,
    platform: {
      ios: {
        primary: string,
        secondary: string,
        success: string,
        error: string,
        warning: string,
      },
      android: {
        primary: string,
        secondary: string,
        success: string,
        error: string,
        warning: string,
      },
    },
  |};

  declare export var colors: Colors;

  /* Utility Functions */

  /**
   * TODO make the Icon Type an export of the react-native-vector-icons type definitions.
   */
  declare export function getIconType(type: IconType): any;

  /**
   * Method to normalize size of fonts across devices
   */
  declare export function normalize(size: number): number;

  /**
   * Registers custom icons
   */
  declare export function registerCustomIconType(id: string, font: any): void;

  declare type Recursive$Shape<T> = { [P: $Keys<T>]: any };

  declare export type FullTheme = {|
    Avatar: $Shape<AvatarProps>,
    Badge: $Shape<BadgeProps>,
    Button: $Shape<ButtonProps>,
    ButtonGroup: $Shape<ButtonGroupProps>,
    Card: $Shape<CardProps>,
    CheckBox: $Shape<CheckBoxProps>,
    Divider: $Shape<DividerProps>,
    Header: $Shape<HeaderProps>,
    Icon: $Shape<IconProps>,
    Image: $Shape<ImageProps>,
    Input: $Shape<InputProps>,
    ListItem: $Shape<ListItemProps>,
    Overlay: $Shape<OverlayProps>,
    PricingCard: $Shape<PricingCardProps>,
    Rating: $Shape<RatingProps>,
    AirbnbRating: $Shape<AirbnbRatingProps>,
    SearchBar: $Shape<SearchBarProps>,
    Slider: $Shape<SliderProps>,
    SocialIcon: $Shape<SocialIconProps>,
    Text: $Shape<TextProps>,
    Tile: $Shape<TileProps>,
    Tooltip: $Shape<TooltipProps>,
    colors: Recursive$Shape<Colors>,
  |};

  declare export type Theme<T = {}> = $Shape<FullTheme> & T;

  declare export type UpdateTheme = (
    updates: Recursive$Shape<FullTheme>,
  ) => void;

  declare export type ReplaceTheme = (
    updates: Recursive$Shape<FullTheme>,
  ) => void;

  declare export type ThemeProps<T> = {|
    theme: Theme<T>,
    updateTheme: UpdateTheme,
    replaceTheme: ReplaceTheme,
  |};

  /**
   * ThemeProvider
   */
  declare export type ThemeProviderProps<T> = {|
    theme?: Theme<T>,
    children: React$Node,
  |};

  declare export class ThemeProvider<T> extends React$Component<
    ThemeProviderProps<T>,
  > {
    updateTheme: UpdateTheme;
    replaceTheme: ReplaceTheme;

    getTheme(): Theme<T>;
  }

  declare export type ThemeConsumerProps<T> = {|
    children(props: ThemeProps<T>): React$Node,
  |};

  declare export class ThemeConsumer<T> extends React$Component<
    ThemeConsumerProps<T>,
  > {}

  declare export var ThemeContext: React$Context<ThemeProps<{}>>;

  declare export type Omit<FromType, Properties> = $Exact<
    $ObjMapi<Properties, <K, V>(k: K, v: V) => $ElementType<FromType, K>>,
  >;
  declare export function withTheme<P = {}, T = {}>(
    component: React$ComponentType<P & ThemeProps<T>>,
  ): React$AbstractComponent<Omit<P, $Keys<ThemeProps<T>>>, any>;
}
