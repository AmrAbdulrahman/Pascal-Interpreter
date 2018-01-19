const readline = require('readline');

const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
const MINUS = 'MINUS';
const MULTIPLY = 'MULTIPLY';
const DIVISION = 'DIVISION';
const MODULAR = 'MODULAR';
const EOF = 'EOF';

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `Token(${this.type}, ${this.value})`;
  }

  repr() {
    return this.toString();
  }
}

class ArithmeticToken {
  constructor(char) {
    switch (char) {
      case '+':
        return new Token(PLUS, char);
      case '-':
        return new Token(MINUS, char);
      case '*':
        return new Token(MULTIPLY, char);
      case '/':
        return new Token(DIVISION, char);
      case '%':
        return new Token(MODULAR, char);
    }
  }

  static isArithmeticOperator(char) {
    return this.operators.indexOf(char) !== -1;
  }

  static get operators() {
    return ['+', '-', '*', '/', '%'];
  }
}

class Interpreter {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.current_token = null;
  }

  fail() {
    throw new Error(`Error parsing ${this.text}`);
  }

  get_next_token() {
    let text = this.text;

    if (this.pos > text.length - 1) {
      return new Token(EOF, null);
    }

    let current_char = text[this.pos++];

    if (isNaN(parseInt(current_char)) === false) {
      return new Token(INTEGER, parseInt(current_char));
    }

    if (ArithmeticToken.isArithmeticOperator(current_char)) {
      return new ArithmeticToken(current_char);
    }

    this.fail();
  }

  eat(TOKEN_TYPE) {
    TOKEN_TYPE = Array.isArray(TOKEN_TYPE) ? TOKEN_TYPE : [TOKEN_TYPE];

    if (TOKEN_TYPE.indexOf(this.current_token.type) !== -1) {
      this.current_token = this.get_next_token();
    } else {
      this.fail();
    }
  }

  expr() {
    this.current_token = this.get_next_token();

    let left = this.current_token;
    this.eat(INTEGER);

    let op = this.current_token;
    this.eat([PLUS, MINUS, MULTIPLY, DIVISION, MODULAR]);

    let right = this.current_token;
    this.eat(INTEGER);

    switch (op.type) {
      case PLUS:
        return left.value + right.value;
      case MINUS:
        return left.value - right.value;
      case MULTIPLY:
        return left.value * right.value;
      case DIVISION:
        return left.value / right.value;
      case MODULAR:
        return left.value % right.value;
      default:
        this.fail();
    }
  }

}

function ask() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('calc> ', (text) => {
    if (!text.trim().length) {
      rl.close();
      return ask();
    }

    let interpreter = new Interpreter(text);
    console.log(interpreter.expr());
    rl.close();
    ask();
  });
}

ask();
