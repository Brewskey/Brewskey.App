import * as React from 'react';

import { usePathname } from 'expo-router';
import { useFormContext } from 'react-hook-form';

import type { UseFormReturn } from 'react-hook-form';

// Context to store MainTabBar slot content
const MainTabBarSlotContext = React.createContext<{
  content: React.ReactNode;
  formContext: UseFormReturn<any> | null;
  setContent: (content: React.ReactNode) => void;
  setFormContext: (formContext: UseFormReturn<any> | null) => void;
}>({
  content: null,
  formContext: null,
  setContent: () => {},
  setFormContext: () => {},
});

export const MainTabBarSlotProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [content, setContent] = React.useState<React.ReactNode>(null);
  const [formContext, setFormContext] =
    React.useState<UseFormReturn<any> | null>(null);
  const pathname = usePathname();
  const prevPathnameRef = React.useRef(pathname);

  // Clear slot when navigating away from a screen that had MainTabBarFill.
  // This runs during render so CustomTabBar sees content=null in the same
  // commit; useEffect cleanup runs too late and causes one frame of stale content.
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
    if (content !== null) {
      setContent(null);
      setFormContext(null);
    }
  }
  // Memoize context value so consumers only re-render when content/formContext change.
  // Inline { content, setContent, formContext, setFormContext } would be a new
  // object every render and force all useMainTabBarSlot() consumers to re-render.
  const value = React.useMemo(
    () => ({ content, setContent, formContext, setFormContext }),
    [content, formContext, setContent, setFormContext],
  );

  // Do NOT wrap children with FormProvider here: toggling it would remount the
  // entire app. FormProvider is applied only around the slot content when it
  // is rendered in the tab bar (CustomTabBar/MainTabBar).
  return (
    <MainTabBarSlotContext.Provider value={value}>
      {children}
    </MainTabBarSlotContext.Provider>
  );
};

export const useMainTabBarSlot = () => React.useContext(MainTabBarSlotContext);

// Fill component that updates the context
export const MainTabBarFill: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const formContext = useFormContext<any>();
  const { setContent, setFormContext } = useMainTabBarSlot();

  React.useLayoutEffect(() => {
    setContent(children);
    setFormContext(formContext);
    return () => {
      setContent(null);
      setFormContext(null);
    };
  }, [children, setContent, setFormContext, formContext]);

  return null;
};
