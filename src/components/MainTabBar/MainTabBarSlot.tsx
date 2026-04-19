import * as React from 'react';

// Context to control MainTabBar visibility
const MainTabBarSlotContext = React.createContext<{
  hideTabBar: boolean;
  registerHide: () => void;
  unregisterHide: () => void;
}>({
  hideTabBar: false,
  registerHide: () => {},
  unregisterHide: () => {},
});

export const MainTabBarSlotProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [hideTabBar, setHideTabBar] = React.useState(false);
  const hideCountRef = React.useRef(0);

  const registerHide = React.useCallback(() => {
    hideCountRef.current += 1;
    if (hideCountRef.current === 1) {
      setHideTabBar(true);
    }
  }, []);

  const unregisterHide = React.useCallback(() => {
    hideCountRef.current = Math.max(0, hideCountRef.current - 1);
    if (hideCountRef.current === 0) {
      setHideTabBar(false);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      hideTabBar,
      registerHide,
      unregisterHide,
    }),
    [hideTabBar, registerHide, unregisterHide],
  );

  return (
    <MainTabBarSlotContext.Provider value={value}>
      {children}
    </MainTabBarSlotContext.Provider>
  );
};

export const useMainTabBarSlot = () => React.useContext(MainTabBarSlotContext);

/** Call in a screen to hide the MainTabBar; resets when this component unmounts. */
export const useHideMainTabBar = (): void => {
  const { registerHide, unregisterHide } = useMainTabBarSlot();
  React.useLayoutEffect(() => {
    registerHide();
    return () => unregisterHide();
  }, [registerHide, unregisterHide]);
};
