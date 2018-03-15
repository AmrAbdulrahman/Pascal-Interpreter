import { Token } from './Token';
import { Position } from '../Common/Position';
import { isDigit, isAlpha, matchIDCharset, failPositionCodePreview } from '../Utils/*';

import {
  // keywords
  CREATE, FUNCTION, TAKES, RETURN,
  IF, ELSE, OTHERWISE,
  EQUALS, NOT, AND, OR, THAN, LESS, GREATER, EQUAL, OF,
  REPEAT, TIMES, WHILE, DO, BREAK, CONTINUE,

  SPACE,
  NEWLINE,
  TAB,
  INTEGER_CONST,
  REAL_CONST,
  STRING_LITERAL,
  PLUS,
  MINUS,
  MULTIPLY,
  DIVISION,
  EOF,
  OPENBRACE,
  CLOSEBRACE,
  OPEN_CURLY_BRACE,
  CLOSE_CURLY_BRACE,
  ID,
  ASSIGN,
  COLON,
  COMMA,
  SINGLE_QUOTE,
  DOUBLE_QUOTE,
  THEN,
  DOT,
  OPEN_SQUARE_BRACKET,
  CLOSE_SQUARE_BRACKET,
} from '../Common/constants';

const RESERVED_KEYWORDS = [
  CREATE, FUNCTION, TAKES, RETURN,
  IF, ELSE, OTHERWISE,
  EQUALS, NOT, AND, OR, THAN, LESS, GREATER, EQUAL,
  THEN, OF, REPEAT, TIMES, WHILE, DO,
  BREAK, CONTINUE,
];

export { RESERVED_KEYWORDS }; // export it for the syntax highlighting

export class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
    this.rowNumber = 0;
    this.colNumber = 0;
  }

  fail() {
    const codePreview = failPositionCodePreview(this.rowNumber, this.colNumber, this.text);

    throw new Error(`${codePreview}Unexpected character '${this.currentChar}'`);
  }

  peek(from = this.pos + 1, len = 1) {
    return this.text.substr(from, len);
  }

  advanceOneChar() {
    if (this.currentChar === NEWLINE) {
      this.rowNumber++;
      this.colNumber = -1;
    }

    const currentCharBeforeAdvance = this.currentChar;
    this.pos ++;
    this.colNumber++;


    if (this.pos < this.text.length) {
      this.currentChar = this.text[this.pos];
    } else {
      this.currentChar = null;
    }

    return currentCharBeforeAdvance;
  }

  advance(count = 1) {
    let res = '';

    while (count-- > 0) {
      res += this.advanceOneChar();
    }

    return res;
  }

  skipWhiteSpace() {
    while (this.currentCharIs(SPACE) ||
           this.currentCharIs(NEWLINE) ||
           this.currentCharIs(TAB)) {
      this.advance();
    }
  }

  skipLineComment() {
    while (this.currentCharIs(NEWLINE) === false) {
      this.advance();
    }

    this.advance(); // skip \n
  }

  skipBlockComment() {
    while (this.peek(this.pos, 2) !== '*/') {
      this.advance();
    }

    this.advance(2); // skip */
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

    return this.newToken(INTEGER_CONST, parseInt(numberStr, 10));
  }

  readID() {
    let idStr = '';

    while (this.currentChar !== null && matchIDCharset(this.currentChar)) {
      idStr += this.advance();
    }

    const idUpperCase = idStr.toUpperCase();
    const keywordIndex = RESERVED_KEYWORDS.indexOf(idUpperCase);

    if (keywordIndex !== -1) {
      return this.newToken(idUpperCase, idUpperCase);
    }

    return this.newToken(ID, idStr);
  }

  readString() {
    const openingChar = this.currentChar;
    let str = '';

    this.advance(); // opening single/double quote

    while (this.currentChar !== openingChar) {
      if (this.currentChar === '\\') {
        str += this.advance();
      }

      str += this.advance();
    }

    this.advance(); // closing single/double quote

    // escape characters
    str = str
      .replace(/\\n/g, `\n`)
      .replace(/\\'/g, `'`)
      .replace(/\\"/g, `"`);

    return this.newToken(STRING_LITERAL, str);
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
        type = DIVISION; break;
      default:
        throw new Error(`Unhandled operator`);
    }

    return this.newToken(type, this.advance());
  }

  getNextToken() {
    while (this.currentChar !== null) {
      if (this.currentCharIs(SPACE) || this.currentCharIs(NEWLINE)) {
        this.skipWhiteSpace();
        continue;
      }

      if (this.peek(this.pos, 2) === '//') {
        this.skipLineComment();
        continue;
      }

      if (this.peek(this.pos, 2) === '/*') {
        this.skipBlockComment();
        continue;
      }

      if (this.currentChar === SINGLE_QUOTE || this.currentChar === DOUBLE_QUOTE) {
        return this.readString();
      }

      if (this.currentChar === '=') {
        return this.newToken(ASSIGN, this.advance());
      }

      if (this.currentChar === ':') {
        return this.newToken(COLON, this.advance());
      }

      if (this.currentChar === ',') {
        return this.newToken(COMMA, this.advance());
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

      if (this.currentCharIs('{')) {
        return this.newToken(OPEN_CURLY_BRACE, this.advance());
      }

      if (this.currentCharIs('}')) {
        return this.newToken(CLOSE_CURLY_BRACE, this.advance());
      }

      if (this.currentCharIs('[')) {
        return this.newToken(OPEN_SQUARE_BRACKET, this.advance());
      }

      if (this.currentCharIs(']')) {
        return this.newToken(CLOSE_SQUARE_BRACKET, this.advance());
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

  newToken(type, value) {
    const col = this.col - (value + '').length;
    const pos = new Position(this.row, col);
    
    return new Token(type, value, pos);
  }

  get row() {
    return this.rowNumber;
  }

  get col() {
    return this.colNumber;
  }
}
