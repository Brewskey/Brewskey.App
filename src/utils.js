// @flow

import * as React from 'react';

export const createRange = (start: number, end: number): Array<number> =>
  Array(end - start + 1)
    .fill(start)
    .map((x: number, y: number): number => x + y);

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

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
