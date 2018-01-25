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
const { isDigit, isAlpha, isAlphaNumeric } = require('./utils');

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

  peek() {
    const peekPos = this.pos + 1;

    if (peekPos >= this.text.length) {
      return null;
    }

    return this.text[peekPos];
  }

  advance(count = 1) {
    this.pos += count;

    if (this.pos >= this.text.length) {
      this.currentChar = null;
    } else {
      this.currentChar = this.text[this.pos];
    }
  }

  skipWhiteSpace() {
    while (this.currentChar === SPACE || this.currentChar === NEWLINE) {
      this.advance();
    }
  }

  readNumber() {
    let numberStr = '';

    while (isDigit(this.currentChar) === true) {
      numberStr += this.currentChar;
      this.advance();
    }

    return parseInt(numberStr);
  }

  readID() {
    let idStr = '';

    while (this.currentChar !== null && isAlphaNumeric(this.currentChar)) {
      idStr += this.currentChar;
      this.advance();
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

      if (isAlpha(this.currentChar)) {
        return this.readID();
      }

      if (this.currentChar === ':' && this.peek() === '=') {
        this.advance(2);
        return new Token(ASSIGN, ':=');
      }

      if (this.currentChar === ';') {
        this.advance();
        return new Token(SEMI, ';');
      }

      if (this.currentChar === '.') {
        this.advance();
        return new Token(DOT, '.');
      }

      if (this.currentCharIsDigit()) {
        return new Token(INTEGER, this.readNumber());
      }

      if (this.currentCharIs('(')) {
        this.advance();
        return new Token(OPENBRACE, '(');
      }

      if (this.currentCharIs(')')) {
        this.advance();
        return new Token(CLOSEBRACE, ')');
      }

      if (this.currentCharIsArithmeticOperator()) {
        const TYPE = this.getCurrentArithmeticOperatorType();
        const operator = this.currentChar;
        this.advance();
        return new Token(TYPE, operator);
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
    return '+-*/%'.indexOf(this.currentChar) !== -1;
  }

  getCurrentArithmeticOperatorType() {
    const types = {
      '+': PLUS,
      '-': MINUS,
      '*': MULTIPLY,
      '/': DIVISION,
      '%': MODULAR,
    };

    return types[this.currentChar];
  }
}

module.exports = Lexer;
