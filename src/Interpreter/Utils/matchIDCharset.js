import { isAlphaNumeric } from './isAlphaNumeric';

export function matchIDCharset(char) {
  return isAlphaNumeric(char) || (char === '_');
}
