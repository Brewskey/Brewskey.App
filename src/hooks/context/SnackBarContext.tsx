import type { Notification } from '../../stores/NotificationsStore';
import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
} from 'react';

type TextStyleType = 'danger' | 'default' | 'success';

type SnackBarMessageParameters = {
  duration?: number;
  position?: 'bottom' | 'top';
  style?: TextStyleType;
  content: ReactElement | string | Notification;
};

export type SnackBarMessage =
  | {
      duration: number;
      position: 'bottom' | 'top';
      style: TextStyleType;
      text: string;
      type: 'text';
    }
  | {
      content: ReactElement;
      duration: number;
      position: 'bottom' | 'top';
      type: 'content';
    }
  | {
      duration: number;
      notification: Notification;
      position: 'bottom' | 'top';
      type: 'notification';
    };

type ContextType = [SnackBarMessage[], (messages: SnackBarMessage[]) => void];

const SnackBarContext = React.createContext<ContextType>(
  [] as unknown as ContextType,
);

export const SnackBarProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [messages, setMessages] = React.useState<SnackBarMessage[]>([]);

  return (
    <SnackBarContext.Provider value={[messages, setMessages]}>
      {children}
    </SnackBarContext.Provider>
  );
};

const isJSX = (value: unknown): value is JSX.Element =>
  React.isValidElement(value);

export const useAddSnackBarMessage = (): ((
  messageParameters: SnackBarMessageParameters,
) => void) => {
  const [messages, setMessages] = useContext(SnackBarContext);

  return useCallback(
    (messageParameters: SnackBarMessageParameters) => {
      let message: SnackBarMessage;

      if (typeof messageParameters.content === 'string') {
        message = {
          duration: 2000,
          position: 'bottom',
          style: 'default',
          type: 'text',
          ...messageParameters,
          text: messageParameters.content,
        };
      } else if (isJSX(messageParameters.content)) {
        message = {
          content: messageParameters.content,
          duration: 2000,
          position: 'top',
          type: 'content',
        };
      } else {
        message = {
          duration: 2000,
          notification: messageParameters.content,
          position: 'top',
          type: 'notification',
        };
      }

      setMessages([...messages, message]);
    },
    [messages, setMessages],
  );
};

export const useRemoveSnackBarMessage = (): (() => void) => {
  const [messages, setMessages] = useContext(SnackBarContext);

  return useCallback(() => {
    messages.shift();
    setMessages([...messages]);
  }, [messages, setMessages]);
};

export const useGetCurrentSnackBarMessage = (): SnackBarMessage | null => {
  const [messages] = useContext(SnackBarContext);
  return messages[0] ?? null;
};
