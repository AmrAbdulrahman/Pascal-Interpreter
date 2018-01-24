const {
  PLUS,
  MINUS,
  MULTIPLY,
  DIVISION } = require('./constants');

const { Num, BinOp } = require('./Parser');

const GLOBAL_SCOPE = {};

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

  visitCompound(node) {
    node.children.forEach(statement => this.visit(statement));
  }

  visitAssign(node) {
    const varName = node.left.value;
    return (GLOBAL_SCOPE[varName] = this.visit(node.right));
  }

  visitNoOp(node) {
    // do nothing here, void, blackhole...
  }

  visitVar(node) {
    const varName = node.value;

    if (GLOBAL_SCOPE[varName] === undefined) {
      throw new Error(`Unknown variable (${varName})`);
    }

    return GLOBAL_SCOPE[varName];
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

  visitUnaryOp(node) {
    return (node.op.type === PLUS ? 1 : -1) * this.visit(node.expr);
  }

  interpretProgram() {
    const ast = this.parser.parseProgram();
    this.visit(ast);
    return GLOBAL_SCOPE;
  }

  interpretExpr() {
    const ast = this.parser.parseExpr();
    return this.visit(ast);
  }

  printRPN(node) {
    if (!node) {
      const ast = this.parser.parseExpr();
      return this.printRPN(ast);
    }

    let result = [];

    if (node.left) {
      result = result.concat(this.printRPN(node.left));
    }

    if (node.right) {
      result = result.concat(this.printRPN(node.right));
    }

    result.push(node + '');

    return result;
  }

  printLISP(node) {
    if (!node) {
      const ast = this.parser.parseExpr();
      return this.printLISP(ast);
    }

    let result = [node + ''];

    if (node.left) {
      result = result.concat(this.printLISP(node.left));
    }

    if (node.right) {
      result = result.concat(this.printLISP(node.right));
    }

    if (node instanceof BinOp) {
      result = ['(', ...result, ')'];
    }

    return result;
  }
}

module.exports = Interpreter;
