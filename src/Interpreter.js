const NodeVisitor = require('./NodeVisitor');
const SymbolTableBuilder = require('./SymbolTableBuilder');

const {
  PLUS,
  MINUS,
  MULTIPLY,
  INTEGER_DIVISION,
  FLOAT_DIVISION,
} = require('./constants');

const { Num, BinOp } = require('./Parser');

const GLOBAL_MEMORY = {};

class Interpreter extends NodeVisitor {
  constructor(parser) {
    super();

    this.parser = parser;
    this.symbolsTableBuilder = new SymbolTableBuilder();
  }

  visitProgram(node) {
    this.visit(node.block);
  }

  visitBlock(node) {
    //node.declarations.forEach(declaration => this.visit(declaration));
    node.declarations.forEach(varDeclarations => {
      varDeclarations.forEach(varDeclaration => this.visit(varDeclaration));
    });

    this.visit(node.compound);
  }

  visitVariableDeclaration(node) {
    // do nothing
  }

  visitCompound(node) {
    node.children.forEach(statement => this.visit(statement));
  }

  visitAssign(node) {
    const varName = node.left.value;

    return (GLOBAL_MEMORY[varName] = this.visit(node.right));
  }

  visitNoOp(node) {
    // do nothing here, void, blackhole...
  }

  visitVar(node) {
    return GLOBAL_MEMORY[node.value];
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
      case FLOAT_DIVISION:
        return left / right;
      case INTEGER_DIVISION:
        return Math.floor(left / right);

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

  interpret() {
    const ast = this.parser.parse();

    this.symbolsTableBuilder.visit(ast);
    this.visit(ast);

    console.log('\nSymbolsTable', this.symbolsTableBuilder.symbolsTable.toString());
    console.log('GLOBAL_MEMORY', GLOBAL_MEMORY);

    return true;
  }
}

module.exports = Interpreter;
