const {
  SPACE,
  NEWLINE,
  INTEGER_CONST,
  REAL_CONST,
  PLUS,
  MINUS,
  MULTIPLY,
  INTEGER_DIVISION,
  FLOAT_DIVISION,
  EOF,
  OPENBRACE,
  CLOSEBRACE,
  BEGIN,
  END,
  DOT,
  ID,
  ASSIGN,
  SEMI,
  COLON,
  COMMA,
} = require('./constants');

const Token = require('./Token');
const { isDigit, isAlpha, matchIDCharset } = require('./utils');

const RESERVED_KEYWORDS = {
  // program
  PROGRAM: new Token('PROGRAM', 'PROGRAM'),

  // types
  INTEGER: new Token('INTEGER', 'INTEGER'),
  REAL: new Token('REAL', 'REAL'),

  // operators
  DIV: new Token('DIV', 'DIV'),

  // block
  VAR: new Token('VAR', 'VAR'),
  BEGIN: new Token('BEGIN', 'BEGIN'),
  END: new Token('END', 'END'),
};

class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
    this.rowNumber = 1;
    this.colNumber = 0;
  }

  fail() {
    throw new Error(`Invalid character`);
  }

  peek(from = this.pos + 1, len = 1) {
    return this.text.substr(from, len);
  }

  advance(count = 1) {
    const res = this.text.substr(this.pos, count);

    this.pos += count;
    this.colNumber += count;

    if (this.pos < this.text.length) {
      this.currentChar = this.text[this.pos];
    } else {
      this.currentChar = null;
    }

    return res;
  }

  skipWhiteSpace() {
    while (this.currentChar === SPACE || this.currentChar === NEWLINE) {
      if (this.currentChar === NEWLINE) {
        this.rowNumber++;
        this.colNumber = 0;
      }

      this.advance();
    }
  }

  skipComment() {
    while (this.currentChar !== '}') {
      this.advance();
    }

    this.advance();
  }

  readNumber() {
    let numberStr = '';
    let hasDot = false;

    while (isDigit(this.currentChar) === true || (this.currentCharIs('.') && !hasDot)) {
      if (this.currentCharIs('.')) {
        hasDot = true;
      }

      numberStr += this.advance();
    }

    if (hasDot) {
      return this.newToken(REAL_CONST, parseFloat(numberStr));
    }

    return this.newToken(INTEGER_CONST, parseInt(numberStr));
  }

  readID() {
    let idStr = '';

    while (this.currentChar !== null && matchIDCharset(this.currentChar)) {
      idStr += this.advance();
    }

    const idUpperCase = idStr.toUpperCase();
    const keyword = RESERVED_KEYWORDS[idUpperCase];

    if (keyword) {
      const row = this.row;
      const col = this.col - (keyword.value + '').length;

      keyword.setLocation(row, col);

      return keyword;
    }

    return this.newToken(ID, idStr);
  }

  getNextToken() {
    while (this.currentChar !== null) {
      if (this.currentCharIs(SPACE) || this.currentCharIs(NEWLINE)) {
        this.skipWhiteSpace();
        continue;
      }

      if (this.currentChar === '{') {
        this.skipComment();
        continue;
      }

      if (this.peek(this.pos, 2) === ':=') {
        return this.newToken(ASSIGN, this.advance(2));
      }

      if (this.currentChar === ':') {
        return this.newToken(COLON, this.advance());
      }

      if (this.currentChar === ',') {
        return this.newToken(COMMA, this.advance());
      }

      if (this.currentChar === ';') {
        return this.newToken(SEMI, this.advance());
      }

      if (this.currentChar === '.') {
        return this.newToken(DOT, this.advance());
      }

      if (this.currentCharIs('(')) {
        return this.newToken(OPENBRACE, this.advance());
      }

      if (this.currentCharIs(')')) {
        return this.newToken(CLOSEBRACE, this.advance());
      }

      if (this.currentCharIsArithmeticOperator()) {
        return this.readArithmeticOperator();
      }

      if (isDigit(this.currentChar)) {
        return this.readNumber();
      }

      if (isAlpha(this.currentChar) || this.currentCharIs('_')) {
        return this.readID();
      }

      this.fail();
    }

    return this.newToken(EOF, null);
  }

  currentCharIs(char) {
    return this.currentChar === char;
  }

  currentCharIsArithmeticOperator() {
    return (
      this.currentCharIs('+') ||
      this.currentCharIs('-') ||
      this.currentCharIs('*') ||
      this.currentCharIs('/') ||
      this.peek(this.pos, 4).toLowerCase() === 'div '
    );
  }

  readArithmeticOperator() {
    let type = null;

    switch (this.currentChar) {
      case '+':
        type = PLUS; break;
      case '-':
        type = MINUS; break;
      case '*':
        type = MULTIPLY; break;
      case '/':
        type = FLOAT_DIVISION; break;
    }

    if (this.peek(this.pos, 4).toLowerCase() === 'div ') {
      type = INTEGER_DIVISION;
    }

    if (type === null) {
      throw new Error(`Unable to map arithmetic operator`);
    }

    const operator = type === INTEGER_DIVISION ? this.advance(3) : this.advance();

    return this.newToken(type, operator);
  }

  newToken(type, value) {
    const row = this.row;
    const col = this.col - (value + '').length;

    return new Token(type, value, row, col);
  }

  get row() {
    return this.rowNumber;
  }

  get col() {
    return this.colNumber;
  }
}

module.exports = Lexer;
