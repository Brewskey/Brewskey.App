// @flow

import type { KegType } from 'brewskey.js-api';

import * as React from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { MAX_OUNCES_BY_KEG_TYPE } from 'brewskey.js-api';

// eslint-disable-next-line
const EMAIL_REGEXP = /^[a-z0-9][a-z0-9-_\.]+@[a-z0-9][a-z0-9-]+[a-z0-9]\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

export const createRange = (start: number, end: number): Array<number> =>
  Array(end - start + 1)
    .fill(start)
    .map((x: number, y: number): number => x + y);

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const validateEmail = (email: string): boolean =>
  EMAIL_REGEXP.test(email);

export const isClassBasedComponent = (
  component: React.ComponentType<any>,
): boolean => !!(component: any).prototype.render;

export const calculateKegLevel = ({
  kegType,
  maxOunces,
  ounces,
}: {
  kegType: KegType,
  maxOunces: number,
  ounces: number,
}): number => {
  const KEG_OUNCES = MAX_OUNCES_BY_KEG_TYPE[kegType];

  const level =
    ((KEG_OUNCES - (KEG_OUNCES - maxOunces) - ounces) / KEG_OUNCES) * 100;
  return Math.min(Math.max(0, level), 100);
};

// todo this probably annotated wrong. It doesn't propogate props type to
// returned element
export const getElementFromComponentProp = <TProps>(
  ComponentProp?: ?React.Element<any> | React.ComponentType<TProps>,
): ?React.Element<any> => {
  if (!ComponentProp) {
    return null;
  }

  if (React.isValidElement(ComponentProp)) {
    return ((ComponentProp: any): React.Element<any>);
  }

  const CastedComponent = ((ComponentProp: any): React.ComponentType<any>);
  return <CastedComponent />;
};

export const fetchJSON = async (...fetchArgs: Array<any>): Promise<any> => {
  // eslint-disable-next-line no-undef
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

export const parseError = (error: Object): string => {
  if (error.ModelState) {
    let resultErrorMessage = '';
    Array.from(Object.values(error.ModelState)).forEach(
      (fieldErrorArray: any) => {
        const castedFieldErrorArray = (fieldErrorArray: Array<string>);

        new Set(castedFieldErrorArray).forEach(
          (fieldError: string): string =>
            (resultErrorMessage = `${resultErrorMessage}\n${fieldError}`),
        );
      },
    );

    return resultErrorMessage;
  }

  if (error.error_description) {
    return error.error_description;
  }

  if (error.Message) {
    return error.Message;
  }

  return "Whoa! Brewskey had an error. We'll try to get it fixed soon.";
};

export const checkIsIphoneX = (): boolean => {
  const { height, width } = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812)
  );
};

export const getStatusBarHeight = ({
  skipAndroid = false,
}: {
  skipAndroid?: boolean,
}): number => {
  if (Platform.OS === 'ios') {
    return checkIsIphoneX() ? 44 : 20;
  }

  if (skipAndroid) {
    return 0;
  }

  return StatusBar.currentHeight;
};
