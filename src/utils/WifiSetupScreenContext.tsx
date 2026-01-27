import React, { createContext, useContext, useMemo, useState } from 'react';

export enum WifiSetupSteps {
  Screen1,
  Screen2,
  Screen3,
  Screen4,
}
interface ContextValue {
  currentStep: WifiSetupSteps;
  particleID?: string;
}
const WifiSetupScreenContext = createContext<
  [ContextValue, (newValue: ContextValue) => void]
>([{ currentStep: WifiSetupSteps.Screen1 }, () => {}]);

export const useWifiSetupScreenContext = (): [
  ContextValue,
  (newValue: ContextValue) => void,
] => useContext(WifiSetupScreenContext);

export const WifiSetupScreenContextProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [value, setValue] = useState<ContextValue>({
    currentStep: WifiSetupSteps.Screen1,
  });
  return (
    <WifiSetupScreenContext.Provider
      value={useMemo(() => [value, setValue], [value, setValue])}
    >
      {children}
    </WifiSetupScreenContext.Provider>
  );
};
