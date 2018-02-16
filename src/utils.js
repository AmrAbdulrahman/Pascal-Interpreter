const ASCII = {
  A: 65,
  Z: 90,
  a: 97,
  z: 122,
  '0': 48,
  '9': 57,
};

function isDigit(char) {
  return isNaN(parseInt(char)) === false;
}

function isAlpha(char) {
  const charCode = char.charCodeAt(0);
  return (charCode >= ASCII.A && charCode <= ASCII.Z) || (charCode >= ASCII.a && charCode <= ASCII.z);
}

function isNumeric(char) {
  const charCode = char.charCodeAt(0);
  return (charCode >= ASCII['0'] && charCode <= ASCII['9']);
}

function isAlphaNumeric(char) {
  return isAlpha(char) || isNumeric(char);
}

function matchIDCharset(char) {
  return isAlphaNumeric(char) || (char === '_');
}

function repeat(str, count) {
  let repeatedStr = '';

  while (count--) {
    repeatedStr += str;
  }

  return repeatedStr;
}

function concat(destination, source) {
  source.forEach(elem => destination.push(elem));
}

function span(str, len) {
  return times(' ', len - str.length) + str;
}

function last(arr) {
  return arr[arr.length - 1];
}

function failPositionCodePreview(row, col, code) {
  const codeLines = code.split('\n');
  const previousLineNumber = `${row}: `;
  const lineNumber = `${row + 1}: `;
  const pointerLine = repeat(' ', lineNumber.length + col) + '^';

  return [
    '\n...\n' + (row > 0 ? previousLineNumber + codeLines[row - 1] : ''),
    lineNumber + codeLines[row],
    pointerLine,
    '...\n'
  ].join('\n');
}

function log(...args) {
  if (process.argv.indexOf('--enable-logs') !== -1) {
    console.log.apply(console, args);
  }
}

module.exports = {
  isDigit,
  isAlpha,
  isNumeric,
  isAlphaNumeric,
  matchIDCharset,
  repeat,
  span,
  concat,
  failPositionCodePreview,
  last,
  log,
};
