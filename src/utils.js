// @flow

export const createRange = (start: number, end: number): Array<number> =>
  [...Array(1 + end - start).keys()].map(v => start + v);

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
