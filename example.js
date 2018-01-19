const readline = require('readline');

const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
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

    if (current_char === '+') {
      return new Token(PLUS, current_char);
    }

    this.fail();
  }

  eat(TOKEN_TYPE) {
    if (this.current_token.type === TOKEN_TYPE) {
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
    this.eat(PLUS);

    let right = this.current_token;
    this.eat(INTEGER);

    let result = left.value + right.value;
    return result;
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
