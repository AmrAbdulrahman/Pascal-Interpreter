const {
  INTEGER,
  PLUS,
  MINUS,
  MULTIPLY,
  DIVISION,
  MODULAR,
  EOF,
  SPACE,
  OPENBRACE,
  CLOSEBRACE } = require('./constants');

const Token = require('./Token');
const { isDigit } = require('./utils');

class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
  }

  fail() {
    throw new Error(`Invalid character`);
  }

  advance() {
    this.pos++;

    if (this.pos >= this.text.length) {
      this.currentChar = null;
    } else {
      this.currentChar = this.text[this.pos];
    }
  }

  skipWhiteSpace() {
    while (this.currentChar === SPACE) {
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

  getNextToken() {
    while (this.currentChar !== null) {
      if (this.currentCharIs(SPACE)) {
        this.skipWhiteSpace();
        continue;
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
