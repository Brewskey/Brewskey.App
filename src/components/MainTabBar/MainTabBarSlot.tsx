import * as React from 'react';

// Context to store MainTabBar slot content
const MainTabBarSlotContext = React.createContext<{
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}>({
  content: null,
  setContent: () => {},
});

export const MainTabBarSlotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = React.useState<React.ReactNode>(null);

  return (
    <MainTabBarSlotContext.Provider value={{ content, setContent }}>
      {children}
    </MainTabBarSlotContext.Provider>
  );
};

export const useMainTabBarSlot = () => {
  return React.useContext(MainTabBarSlotContext);
};

// Fill component that updates the context
export const MainTabBarFill: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setContent } = useMainTabBarSlot();

  React.useEffect(() => {
    setContent(children);
    return () => {
      setContent(null);
    };
  }, [children, setContent]);

  return null;
};
