// NavigationService stub - replace with React Navigation hooks where possible
// This is a temporary implementation to maintain compatibility
import { CommonActions, NavigationContainerRefWithCurrent } from '@react-navigation/native';

let navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList> | null = null;

export const setNavigationRef = (ref: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList> | null): void => {
  navigationRef = ref;
};

const navigate = <RouteName extends keyof ReactNavigation.RootParamList>(
  name: RouteName,
  params?: ReactNavigation.RootParamList[RouteName],
): void => {
  if (navigationRef?.isReady()) {
     
    navigationRef.navigate(name as any, params as any);
  }
};

const reset = (index: number | string, name: string): void => {
  if (navigationRef?.isReady()) {
    const indexNum = typeof index === 'string' ? 0 : index;
    navigationRef.dispatch(
      CommonActions.reset({
        index: indexNum,
        routes: [{ name: typeof index === 'string' ? index : name }],
      }),
    );
  }
};

const NavigationService = {
  navigate,
  reset,
};

export default NavigationService;
