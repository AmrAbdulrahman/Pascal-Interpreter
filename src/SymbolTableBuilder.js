const NodeVisitor = require('./NodeVisitor');
const SymbolTable = require('./Symbols/SymbolTable');
const VarSymbol = require('./Symbols/VarSymbol');

module.exports = class SymbolTableBuilder extends NodeVisitor {
  constructor() {
    super();

    this.symbolsTable = new SymbolTable();
  }

  visitProgram(node) {
    this.visit(node.block);
  }

  visitBlock(node) {
    node.declarations.forEach(varDeclarations => {
      varDeclarations.forEach(varDeclaration => this.visit(varDeclaration));
    });

    this.visit(node.compound);
  }

  visitVariableDeclaration(node) {
    const typeName = node.type.value;
    const typeSymbol = this.symbolsTable.lookup(typeName);
    const varName = node.variable.value;
    const varSymbol = new VarSymbol(varName, typeSymbol);

    this.symbolsTable.define(varSymbol);
  }

  visitCompound(node) {
    node.children.forEach(statement => this.visit(statement));
  }

  visitAssign(node) {
    const varName = node.left.value;
    const varSymbol = this.symbolsTable.lookup(varName);

    if (varSymbol === undefined) {
      throw new Error(`Undeclared variable ${varName}`);
    }

    this.visit(node.right);
  }

  visitVar(node) {
    const varName = node.value;
    const varSymbol = this.symbolsTable.lookup(varName);

    if (varSymbol === undefined) {
      throw new Error(`Undeclared variable ${varName}`);
    }
  }

  visitBinOp(node) {
    this.visit(node.left);
    this.visit(node.right);
  }

  visitNoOp(node) {
    // do nothing here, void, blackhole...
  }

  visitNum(node) {
    // do nothing
  }

  visitUnaryOp(node) {
    this.visit(node.expr);
  }
}
