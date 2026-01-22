import * as React from 'react';
import { FormProvider, useFormContext, UseFormReturn } from 'react-hook-form';

// Context to store MainTabBar slot content
const MainTabBarSlotContext = React.createContext<{
  content: React.ReactNode;
  formContext: UseFormReturn<any> | null;
  setContent: (content: React.ReactNode) => void;
  setFormContext: (formContext: UseFormReturn<any>) => void;
}>({
  content: null,
  formContext: null,
  setContent: () => {},
  setFormContext: () => {},
});

export const MainTabBarSlotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = React.useState<React.ReactNode>(null);
  const [formContext, setFormContext] = React.useState<UseFormReturn<any> | null>(null);
  return (
    <MainTabBarSlotContext.Provider value={{ content, setContent, formContext, setFormContext }}>
      {formContext != null ? <FormProvider {...formContext}>{children}</FormProvider> : children}
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
  const formContext = useFormContext<any>();
  const { setContent, setFormContext } = useMainTabBarSlot();

  React.useEffect(() => {
    setContent(children);
    setFormContext(formContext);
    return () => {
      setContent(null);
      setFormContext(null);
    };
  }, [children, setContent, setFormContext, formContext]);

  return null;
};
