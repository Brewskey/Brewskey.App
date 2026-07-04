// The @react-native-vector-icons migration in rneui v5 broke the type chain:
// `IconProps` extends `IconButtonProps` from `react-native-vector-icons/Icon`,
// which no longer resolves, so the core icon props (`name`, `color`, `size`)
// vanished from the public `Icon` type even though the runtime still forwards
// them. Re-add them here so every `<Icon .../>` call site type-checks again.
import '@rneui/base';

declare module '@rneui/base' {
  interface IconProps {
    name?: string;
    color?: string;
    size?: number;
  }
}
