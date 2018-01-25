const {
  SPACE,
  NEWLINE,
  INTEGER,
  PLUS,
  MINUS,
  MULTIPLY,
  DIVISION,
  MODULAR,
  EOF,
  OPENBRACE,
  CLOSEBRACE,
  BEGIN,
  END,
  DOT,
  ID,
  ASSIGN,
  SEMI,
  } = require('./constants');

const Token = require('./Token');
const { isDigit, isAlpha, matchIDCharset } = require('./utils');

const RESERVED_KEYWORDS = {
  BEGIN: new Token('BEGIN', 'BEGIN'),
  END: new Token('END', 'END'),
};

class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
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

    if (this.pos < this.text.length) {
      this.currentChar = this.text[this.pos];
    } else {
      this.currentChar = null;
    }

    return res;
  }

  skipWhiteSpace() {
    while (this.currentChar === SPACE || this.currentChar === NEWLINE) {


      this.advance();
    }
  }

  readNumber() {
    let numberStr = '';

    while (isDigit(this.currentChar) === true) {
      numberStr += this.advance();
    }

    return new Token(INTEGER, parseInt(numberStr));
  }

  readID() {
    let idStr = '';

    while (this.currentChar !== null && matchIDCharset(this.currentChar)) {
      idStr += this.advance();
    }

    const idUpperCase = idStr.toUpperCase();

    return RESERVED_KEYWORDS[idUpperCase] || new Token(ID, idStr);
  }

  getNextToken() {
    while (this.currentChar !== null) {
      if (this.currentCharIs(SPACE) || this.currentCharIs(NEWLINE)) {
        this.skipWhiteSpace();
        continue;
      }

      if (this.peek(this.pos, 2) === ':=') {
        return new Token(ASSIGN, this.advance(2));
      }

      if (this.currentChar === ';') {
        return new Token(SEMI, this.advance());
      }

      if (this.currentChar === '.') {
        return new Token(DOT, this.advance());
      }

      if (this.currentCharIs('(')) {
        return new Token(OPENBRACE, this.advance());
      }

      if (this.currentCharIs(')')) {
        return new Token(CLOSEBRACE, this.advance());
      }

      if (this.currentCharIsArithmeticOperator()) {
        return this.readArithmeticOperator();
      }

      if (this.currentCharIsDigit()) {
        return this.readNumber();
      }

      if (isAlpha(this.currentChar) || this.currentChar === '_') {
        return this.readID();
      }

      this.fail();
    }

    return new Token(EOF, null);
  }

  currentCharIsDigit() {
    return isDigit(this.currentChar);
  }

  currentCharIs(char) {
    return this.currentChar === char;
  }

  currentCharIsArithmeticOperator() {
    return (
      this.currentChar === '+' ||
      this.currentChar === '-' ||
      this.currentChar === '*' ||
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
    }

    if (this.peek(this.pos, 4).toLowerCase() === 'div ') {
      type = DIVISION;
    }

    if (type === null) {
      throw new Error(`Unable to map arithmetic operator`);
    }

    const operator = type === DIVISION ? this.advance(3) : this.advance();

    return new Token(type, operator);
  }
}

module.exports = Lexer;
