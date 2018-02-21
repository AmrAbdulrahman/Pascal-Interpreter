import { NodeVisitor } from './NodeVisitor';
import { Scope } from './Scope';
import { BuiltinsScope } from './BuiltinsScope';
import { VarSymbol } from './Symbols/VarSymbol';
import { BuiltinVarSymbol } from './Symbols/BuiltinVarSymbol';
import { ProcedureSymbol } from './Symbols/ProcedureSymbol';
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

  visitProcedureDecl(node) {
    const procedureName = node.id.value;

    const procedureSymbol = new ProcedureSymbol(procedureName, node.block);

    if (this.currentScope.has(procedureName)) {
      throw new Error(`${procedureName} already declared in the current scope`);
    }

    this.currentScope.insert(procedureSymbol);

    const procedureScope = new Scope(procedureName, this.currentScope);

    this.currentScope = procedureScope;

    node.params.forEach(param => {
      const paramType = this.currentScope.lookup(param.type.value);
      const paramName = param.variable.value;
      const paramSymbol = new VarSymbol(paramName, paramType);

      if (this.currentScope.has(paramName)) {
        throw new Error(`Duplicate parameter '${paramName}'`);
      }

      this.currentScope.insert(paramSymbol);
      procedureSymbol.params.push(paramSymbol);
    });

    // visit function body
    this.visit(node.block);

    // console.log(this.currentScope);
    // close function scope
    this.currentScope = this.currentScope.parent;
  }

  visitVariableDeclaration(node) {
    const typeName = node.type.value;
    const typeSymbol = this.currentScope.lookup(typeName);
    const varName = node.variable.value;
    const alreadyExists = this.currentScope.has(varName);
    const existingVarSymbol = this.currentScope.lookup(varName)

    if (existingVarSymbol instanceof BuiltinVarSymbol) {
      throw new Error(`Can't declare a variable with reserved keyword '${varName}'`);
    }

    if (alreadyExists === true) {
      throw new Error(`${node.variable.token.getLocation()} Duplicate identifier '${varName}' found`);
    }

    const varSymbol = new VarSymbol(varName, typeSymbol);

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

  visitProcedureInvokation(node) {
    const procedureName = node.id.value;
    const procedureSymbol = this.currentScope.lookup(procedureName);

    if (procedureName === PRINT) {
      return;
    }

    if (procedureSymbol === null) {
      throw new Error(`Undeclared procedure '${procedureName}'`);
    }

    if (procedureSymbol.params.length !== node.args.length) {
      throw new Error(`Procedure '${procedureName}' accepts (${procedureSymbol.params.length}) argument(s) [${procedureSymbol.params.map(p => p.name + ':' + p.type.name).join(',')}]`);
    }
  }
}
