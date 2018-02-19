// @flow

export const createRange = (start: number, end: number): Array<number> =>
  [...Array(1 + end - start).keys()].map(
    (index: number): number => start + index,
  );

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const isClassBasedComponent = (
  component: React.ComponentType<any>,
): boolean => !!component.prototype.render;
