import { NodeVisitor } from './NodeVisitor';
import { Scope } from './Scope';
import { BuiltinsScope } from './BuiltinsScope';
import { VarSymbol } from './Symbols/VarSymbol';
import { BuiltinVarSymbol } from './Symbols/BuiltinVarSymbol';
import { FunctionSymbol } from './Symbols/FunctionSymbol';
import { PRINT } from './constants';

export class SemanticAnalyzer extends NodeVisitor {
  constructor() {
    super();

    this.currentScope = new BuiltinsScope();
  }

  visitProgram(node) {
    this.visitBlock(node);
  }

  visitBlock(node) {
    node.children.forEach(statement => this.visit(statement));
  }

  visitScopedBlock(node) {
    this.currentScope = new Scope('block', this.currentScope);

    this.visitBlock(node);

    this.currentScope = this.currentScope.parent;
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

  visitStr(node) {
    // do nothing
  }

  visitCondition(node) {
    this.visit(node.expr);
  }

  visitUnaryOp(node) {
    this.visit(node.expr);
  }

  visitFunctionDecl(node) {
    const functionName = node.id.value;
    const functionSymbol = new FunctionSymbol(functionName, node.block);

    if (this.currentScope.has(functionName)) {
      throw new Error(`${functionName} already declared in the current scope`);
    }

    this.currentScope.insert(functionSymbol);

    const functionScope = new Scope(functionName, this.currentScope);

    this.currentScope = functionScope;

    node.params.forEach(param => {
      //const paramType = this.currentScope.lookup(param.type.value);
      const paramName = param.value;
      const paramSymbol = new VarSymbol(paramName, null);

      if (this.currentScope.has(paramName)) {
        throw new Error(`Duplicate parameter '${paramName}'`);
      }

      this.currentScope.insert(paramSymbol);
      functionSymbol.params.push(paramSymbol);
    });

    // visit function body
    this.visit(node.block);

    // close function scope
    this.currentScope = this.currentScope.parent;
  }

  visitVariableDeclaration(node) {
    //const typeName = node.type.value;
    //const typeSymbol = this.currentScope.lookup(typeName);
    const varName = node.variable.value;
    const alreadyExists = this.currentScope.has(varName);
    const existingVarSymbol = this.currentScope.lookup(varName)

    if (existingVarSymbol instanceof BuiltinVarSymbol) {
      throw new Error(`Can't declare a variable with reserved keyword '${varName}'`);
    }

    if (alreadyExists === true) {
      throw new Error(`${node.variable.token.getLocation()} Duplicate identifier '${varName}' found`);
    }

    const varSymbol = new VarSymbol(varName, null);

    this.currentScope.insert(varSymbol);
  }

  visitAssign(node) {
    const varName = node.left.value;
    const varSymbol = this.currentScope.lookup(varName);

    if (varSymbol instanceof BuiltinVarSymbol) {
      throw new Error(`Can't assign value to builtin symbol '${varSymbol.name}'`);
    }

    if (varSymbol === null) {
      throw new Error(`Undeclared variable ${varName}`);
    }

    this.visit(node.right);
  }

  visitVar(node) {
    const varName = node.value;
    const varSymbol = this.currentScope.lookup(varName);

    if (varSymbol === null) {
      throw new Error(`Undeclared variable '${varName}'`);
    }
  }

  visitReturn(node) {
    this.visit(node.expr);
  }

  visitIf(node) {
    for (var i = 0; i < node.ifs.length; i++) {
      const { condition, body } = node.ifs[i];
      this.visit(condition);
      this.visit(body);
    }

    if (node.otherwise) {
      this.visit(node.otherwise);
    }
  }

  visitFunctionInvocation(node) {
    const functionName = node.id.value;
    const functionSymbol = this.currentScope.lookup(functionName);

    if (functionName === PRINT) {
      return;
    }

    if (functionSymbol === null) {
      throw new Error(`Undeclared function '${functionName}'`);
    }

    if (functionSymbol.params.length !== node.args.length) {
      throw new Error(`Function '${functionName}' accepts (${functionSymbol.params.length}) argument(s) [${functionSymbol.params.map(p => p.name).join(',')}]`);
    }
  }
}
