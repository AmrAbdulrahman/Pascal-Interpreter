export function isDigit(char) {
  return isNaN(parseInt(char, 10)) === false;
}
