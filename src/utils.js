// @flow

import * as React from 'react';

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

export const calculateKegLevel = (
  ounces: number,
  maxOunces: number,
): number => {
  if (maxOunces === 0) {
    return 0;
  }

  const level = (maxOunces - ounces) / maxOunces * 100;
  return level <= 0 ? 0 : level;
};

export const getElementFromComponentProp = <TProps>(
  ComponentProp?: ?React.Element<TProps> | React.ComponentType<any>,
): React.Element<TProps> => {
  if (!ComponentProp) {
    return null;
  }
  return React.isValidElement(ComponentProp) ? (
    ((ComponentProp: any): React.Element<TProps>)
  ) : (
    <ComponentProp />
  );
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
    throw new Error(parseError(responseJson));
  }

  return responseJson;
};

export const parseError = (error: Object): string => {
  if (error.ModelState) {
    let resultErrorMessage = '';
    Array.from(Object.values(error.ModelState)).map(fieldErrorArray =>
      new Set(fieldErrorArray).forEach(
        (fieldError: string): string =>
          (resultErrorMessage = `${resultErrorMessage}\n${fieldError}`),
      ),
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
