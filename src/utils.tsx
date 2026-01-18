import type { KegType } from '@brewskey/js-api';

import * as React from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';

 
const EMAIL_REGEXP =
  /^[a-z0-9][a-z0-9-_\.]+@[a-z0-9][a-z0-9-]+[a-z0-9]\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

export const createRange = (start: number, end: number): number[] =>
  Array(end - start)
    .fill(start)
    .map((x: number, y: number): number => x + y);

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const validateEmail = (email: string): boolean =>
  EMAIL_REGEXP.test(email);

export const isClassBasedComponent = (
  component: React.ComponentType,
): boolean => !!component.prototype.render;

export const calculateKegLevel = ({
  kegType,
  maxOunces,
  ounces,
}: {
  kegType: KegType;
  maxOunces: number;
  ounces: number;
}): number => {
  const KEG_OUNCES = MAX_OUNCES_BY_KEG_TYPE[kegType];

  const level =
    ((KEG_OUNCES - (KEG_OUNCES - maxOunces) - ounces) / KEG_OUNCES) * 100;
  return Math.min(Math.max(0, level), 100);
};

// todo this probably annotated wrong. It doesn't propogate props type to
// returned element
export const getElementFromComponentProp = <
  TProps extends Record<string, unknown>,
>(
  ComponentProp?:
    | React.ReactNode
    | null
    | undefined
    | React.ComponentType<TProps>,
): React.ReactNode | null | undefined => {
  if (!ComponentProp) {
    return null;
  }

  if (React.isValidElement(ComponentProp)) {
    return ComponentProp as React.ReactNode;
  }

  const CastedComponent = ComponentProp as React.ComponentType;
  return <CastedComponent />;
};

type ErrorWithModelState = {
  ModelState?: Record<string, string[]>;
  error_description?: string;
  Message?: string;
};

export const parseError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as ErrorWithModelState;

    if (errorObj.ModelState) {
      let resultErrorMessage = '';
      Array.from(Object.values(errorObj.ModelState)).forEach((fieldErrorArray) => {
        if (Array.isArray(fieldErrorArray)) {
          new Set(fieldErrorArray).forEach(
            (fieldError: string): string =>
              (resultErrorMessage = `${resultErrorMessage}\n${fieldError}`),
          );
        }
      });

      return resultErrorMessage;
    }

    if (errorObj.error_description) {
      return errorObj.error_description;
    }

    if (errorObj.Message) {
      return errorObj.Message;
    }
  }

  return "Whoa! Brewskey had an error. We'll try to get it fixed soon.";
};

export const fetchJSON = async <TResult extends Record<string, unknown>>(
  ...fetchArgs: Parameters<typeof fetch>
): Promise<TResult> => {
   
  const response = await fetch(...fetchArgs);

  let responseJson;
  try {
    responseJson = await response.json();
  } catch (error) {
    responseJson = null;
  }

  if (!response.ok) {
    throw new Error(responseJson ? parseError(responseJson) : 'Whoops! Error!');
  }

  return responseJson;
};

export const checkIsIphoneX = (): boolean => {
  const { height, width } = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (height === 812 || width === 812)
  );
};

export const getStatusBarHeight = ({
  skipAndroid = false,
}: {
  skipAndroid?: boolean;
}): number => {
  if (Platform.OS === 'ios') {
    return checkIsIphoneX() ? 44 : 20;
  }

  if (skipAndroid) {
    return 0;
  }

  return StatusBar.currentHeight ?? 0;
};
