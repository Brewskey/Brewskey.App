// @flow

import * as React from 'react';

// eslint-disable-next-line
const EMAIL_REGEXP = /^[a-z0-9][a-z0-9-_\.]+@[a-z0-9][a-z0-9-]+[a-z0-9]\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

export const createRange = (start: number, end: number): Array<number> =>
  [...Array(1 + end - start).keys()].map(
    (index: number): number => start + index,
  );

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
  return level <= 0 ? 0 : level.toFixed(0);
};

export const getElementFromComponentProp = <TProps>(
  ComponentProp?: ?React.Element<TProps> | React.ComponentType<any>,
): React.Element<TProps> => {
  if (!ComponentProp) {
    return null;
  }
  return React.isValidElement(ComponentProp) ? (
    ComponentProp
  ) : (
    <ComponentProp />
  );
};

export const fetchJSON = async (...fetchArgs: Array<any>): Promise<any> => {
  // eslint-disable-next-line no-undef
  const response = await fetch(...fetchArgs);

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.error_description);
  }

  return responseJson;
};
