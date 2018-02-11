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

function times(str, count) {
  let res = str;

  while (--count > 0) {
    res += str;
  }

  return res;
}

function span(str, len) {
  return times(' ', len - str.length) + str;
}

module.exports = {
  isDigit,
  isAlpha,
  isNumeric,
  isAlphaNumeric,
  matchIDCharset,
  times,
  span,
};
