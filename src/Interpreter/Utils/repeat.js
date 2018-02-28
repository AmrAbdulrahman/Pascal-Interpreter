export function repeat(str, count) {
  let repeatedStr = '';

  while (count--) {
    repeatedStr += str;
  }

  return repeatedStr;
}
