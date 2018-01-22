const {
  PLUS,
  MINUS,
  MULTIPLY,
  DIVISION } = require('./constants');

const { Num, BinOp } = require('./Parser');

class Interpreter {
  constructor(parser) {
    this.parser = parser;
  }

  visit(node) {
    const methodName = node.name;

    if (this[`visit${methodName}`]) {
      return this[`visit${methodName}`](node);
    }

    throw new Error(`a method visit${methodName} is missing`);
  }

  visitBinOp(node) {
    const left = this.visit(node.left);
    const right = this.visit(node.right);

    switch (node.op.type) {
      case PLUS:
        return left + right;
      case MINUS:
        return left - right;
      case MULTIPLY:
        return left * right;
      case DIVISION:
        return left / right;

      default:
        throw new Error(`Unhandled operator type ${node.op.type}`);
    }
  }

  visitNum(node) {
    return node.value;
  }

  interpret() {
    const ast = this.parser.parse();
    return this.visit(ast);
  }
}

module.exports = Interpreter;
