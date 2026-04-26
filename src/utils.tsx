import * as React from 'react';

import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';
import { Dimensions, Platform, StatusBar } from 'react-native';

import { parseError } from 'utils/errorParsing';

import type { EntityID, KegType } from '@brewskey/js-api';

export { parseError };

const EMAIL_REGEXP =
  /^[a-z0-9][a-z0-9_.-]+@[a-z0-9][a-z0-9-]+[a-z0-9]\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

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
  const KEG_OUNCES =
    kegType != null
      ? MAX_OUNCES_BY_KEG_TYPE[kegType as keyof typeof MAX_OUNCES_BY_KEG_TYPE]
      : undefined;

  if (
    KEG_OUNCES == null ||
    !Number.isFinite(KEG_OUNCES) ||
    !Number.isFinite(maxOunces) ||
    !Number.isFinite(ounces)
  ) {
    return 0;
  }

  const level =
    ((KEG_OUNCES - (KEG_OUNCES - maxOunces) - ounces) / KEG_OUNCES) * 100;
  const clamped = Math.min(Math.max(0, level), 100);
  return Number.isFinite(clamped) ? clamped : 0;
};

// todo this probably annotated wrong. It doesn't propogate props type to
// returned element
export const getElementFromComponentProp = <
  TProps extends Record<string, unknown>,
>(
  ComponentProp?: React.ReactNode | null | React.ComponentType<TProps>,
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

export const fetchJSON = async <TResult extends Record<string, unknown>>(
  ...fetchArgs: Parameters<typeof fetch>
): Promise<TResult> => {
  const response = await fetch(...fetchArgs);

  let responseJson;
  try {
    responseJson = await response.json();
  } catch {
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

/**
 * Extracts and parses the ID from a ShortenedEntity or any object with an id property.
 * Converts string IDs to numbers when possible.
 * Returns undefined if the entity is null or undefined.
 */
export const extractShortenedEntityId = (
  entity: { id: EntityID } | null | undefined,
): EntityID | undefined => {
  if (entity == null) {
    return undefined;
  }

  const { id } = entity;
  if (id == null) {
    return undefined;
  }

  // Parse string IDs to numbers when possible
  if (typeof id === 'string') {
    const numId = Number(id);
    return !isNaN(numId) && id.trim() !== '' ? numId : id;
  }

  return id;
};
