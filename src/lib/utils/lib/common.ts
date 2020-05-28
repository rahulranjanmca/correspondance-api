/* eslint-disable @typescript-eslint/no-explicit-any */
/* node_modules */
import strfy from 'json-stringify-safe';
import _ from 'lodash';

/* file constants */
const TRUE = 'TRUE';
const FALSE = 'FALSE';

const _sanitizeError = (error: Error): void => {
  try {
    // eslint-disable-next-line no-param-reassign
    if (process.env.NODE_ENV === 'PREP' || process.env.NODE_ENV === 'PROD') error.stack = undefined;
  } catch (err) {
    throw err;
  }
};

const _stringify = (thing: any, native = false): string => {
  try {
    let stringified: string;
    if (native) stringified = JSON.stringify(thing);
    stringified = strfy(thing);
    return stringified;
  } catch (err) {
    throw err;
  }
};

const _isStringEmpty = (str: string): boolean => {
  try {
    if (_.isString(str)) {
      return _.isEmpty(_.trim(str));
    }
    return true;
  } catch (err) {
    throw err;
  }
};

const _stringToBoolean = (value: any, defaultValueAsBoolean: boolean | any): boolean => {
  try {
    if (!_.isNil(defaultValueAsBoolean) && !_.isBoolean(defaultValueAsBoolean)) {
      throw new Error(`Parameter defaultValueAsBoolean must be boolean value, received ${typeof defaultValueAsBoolean}`);
    }
    const noDefaultProvidedSoThrow = _.isNil(defaultValueAsBoolean);
    let booleanReturn: any;
    try {
      if (_.isNil(value) || _isStringEmpty(value)) {
        throw new Error('Cannot properly determine boolean value from empty string');
      }
      if (Object.is(_.trim(value.toUpperCase()), TRUE)) {
        booleanReturn = true;
      } else if (Object.is(_.trim(value.toUpperCase()), FALSE)) {
        booleanReturn = false;
      }
      if (booleanReturn === undefined && noDefaultProvidedSoThrow) {
        throw new Error(`Cannot determine correct boolean value for ${value} and no default provided`);
      } else if (booleanReturn === undefined) {
        booleanReturn = defaultValueAsBoolean;
      }
      return booleanReturn;
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

export default class Common {
  public stringify = _stringify;
  public sanitizeError = _sanitizeError;
  public isStringEmpty = _isStringEmpty;
  public stringToBoolean = _stringToBoolean;
}
