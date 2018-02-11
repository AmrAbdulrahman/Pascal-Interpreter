const NodeVisitor = require('./NodeVisitor');
const Scope = require('./Scope');
const BuiltinsScope = require('./BuiltinsScope');
const BaseSymbol = require('./Symbols/BaseSymbol');
const VarSymbol = require('./Symbols/VarSymbol');
const ProcedureSymbol = require('./Symbols/ProcedureSymbol');

module.exports = class SemanticAnalyzer extends NodeVisitor {
  constructor() {
    super();

    this.currentScope = new BuiltinsScope();
  }

  visitProgram(node) {
    // insert appName in the builtints scope
    const appName = new BaseSymbol(node.id.value);
    this.currentScope.insert(appName);

    // open global scope
    this.currentScope = new Scope('global', this.currentScope);

    this.visit(node.block);

    console.log(this.currentScope);
    // close global scope
    this.currentScope = this.currentScope.parent;

    console.log(this.currentScope);
  }

  visitBlock(node) {
    node.declarations.forEach(declaration => {
      if (Array.isArray(declaration)) { // variables declarations
        declaration.forEach(varDeclaration => this.visit(varDeclaration));
      } else {
        this.visit(declaration); // procedure
      }
    });

    this.visit(node.compound);
  }

  visitCompound(node) {
    node.children.forEach(statement => this.visit(statement));
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

  visitProcedureDecl(node) {
    const procedureName = node.id.value;

    const procedureSymbol = new ProcedureSymbol(procedureName);
    this.currentScope.insert(procedureSymbol);

    const procedureScope = new Scope(procedureName, this.currentScope);

    this.currentScope = procedureScope;

    node.params.forEach(param => {
      const paramType = this.currentScope.lookup(param.type.value);
      const paramName = param.variable.value;
      const varSymbol = new VarSymbol(paramName, paramType);

      if (this.currentScope.has(paramName)) {
        throw new Error(`Duplicate parameter '${varName}'`);
      }

      this.currentScope.insert(varSymbol);
      procedureSymbol.params.push(varSymbol);
    });

    // visit function body
    this.visit(node.block);

    console.log(this.currentScope);
    // close function scope
    this.currentScope = this.currentScope.parent;
  }

  visitVariableDeclaration(node) {
    const typeName = node.type.value;
    const typeSymbol = this.currentScope.lookup(typeName);
    const varName = node.variable.value;
    const alreadyExists = this.currentScope.has(varName);

    if (alreadyExists === true) {
      throw new Error(`${node.variable.token.getLocation()} Duplicate identifier '${varName}' found`);
    }

    const varSymbol = new VarSymbol(varName, typeSymbol);

    this.currentScope.insert(varSymbol);
  }

  visitAssign(node) {
    const varName = node.left.value;
    const varSymbol = this.currentScope.lookup(varName);

    if (varSymbol === undefined) {
      throw new Error(`Undeclared variable ${varName}`);
    }

    this.visit(node.right);
  }

  visitVar(node) {
    const varName = node.value;
    const varSymbol = this.currentScope.lookup(varName);

    if (varSymbol === undefined) {
      throw new Error(`Symbol(identifier) not found '${varName}'`);
    }
  }
}
