import React, { createContext, useContext, useState } from 'react';

export enum WifiSetupSteps {
  Screen1,
  Screen2,
  Screen3,
  Screen4,
}
type ContextValue = {
  currentStep: WifiSetupSteps;
  particleID?: string;
};
const WifiSetupScreenContext = createContext<
  [ContextValue, (newValue: ContextValue) => void]
>([{ currentStep: WifiSetupSteps.Screen1 }, () => {}]);

export const useWifiSetupScreenContext = () =>
  useContext(WifiSetupScreenContext);

export const WifiSetupScreenContextProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [value, setValue] = useState<ContextValue>({
    currentStep: WifiSetupSteps.Screen1,
  });
  return (
    <WifiSetupScreenContext.Provider value={[value, setValue]}>
      {children}
    </WifiSetupScreenContext.Provider>
  );
};
