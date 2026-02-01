import * as React from 'react';

import { usePathname } from 'expo-router';

// Context to control MainTabBar visibility
const MainTabBarSlotContext = React.createContext<{
  hideTabBar: boolean;
  setHideTabBar: (hide: boolean) => void;
}>({
  hideTabBar: false,
  setHideTabBar: () => {},
});

export const MainTabBarSlotProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [hideTabBar, setHideTabBar] = React.useState(false);
  const pathname = usePathname();
  const prevPathnameRef = React.useRef(pathname);

  // Clear hideTabBar when navigating away from a screen that called useHideMainTabBar.
  // This runs during render so CustomTabBar sees the update in the same commit.
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
    if (hideTabBar) {
      setHideTabBar(false);
    }
  }
  const value = React.useMemo(
    () => ({
      hideTabBar,
      setHideTabBar,
    }),
    [hideTabBar, setHideTabBar],
  );

  return (
    <MainTabBarSlotContext.Provider value={value}>
      {children}
    </MainTabBarSlotContext.Provider>
  );
};

export const useMainTabBarSlot = () => React.useContext(MainTabBarSlotContext);

/** Call in a screen to hide the MainTabBar; resets on unmount / navigation. */
export const useHideMainTabBar = (): void => {
  const { setHideTabBar } = useMainTabBarSlot();
  React.useLayoutEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);
};
