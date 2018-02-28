import { isAlpha, isDigit } from './*';

export function isAlphaNumeric(char) {
  return isAlpha(char) || isDigit(char);
}
