import { NodeVisitor } from './Common/NodeVisitor';
import { Scope } from './Common/Scope';
import { BuiltinsScope } from './Common/Scope/BuiltinsScope';
import { FunctionSymbol, BuiltinVarSymbol, VarSymbol } from './Common/Symbols/*';
import { PRINT, OF, DOT } from './Common/constants';
import { Var, BinOp } from './Parser/ASTNodes/*';

export class SemanticAnalyzer extends NodeVisitor {
  constructor() {
    super();

    this.currentScope = new BuiltinsScope();
  }

  openNewScope(name) {
    this.currentScope = new Scope(name, this.currentScope);
  }

  closeCurrentScope() {
    this.currentScope = this.currentScope.parent;
  }

  visitProgram(node) {
    this.visitBlock(node);
  }

  visitBlock(node) {
    node.children.forEach(statement => this.visit(statement));
  }

  visitScopedBlock(node) {
    this.openNewScope('block');
    this.visitBlock(node);
    this.closeCurrentScope();
  }

  visitBinOp(node) {
    if (node.op.type === OF) {
      return this.visitMemberAccessNode(node);
    }

    if (node.op.type === DOT) {
      return this.visitDottedMemberAccessNode(node);
    }

    this.visit(node.left);
    this.visit(node.right);
  }

  visitMemberAccessNode(node) {
    this.visit(node.right);

    if (node.left instanceof Var === false) {
      throw new Error(`'${node.left}' must be a key`);
    }
  }

  visitDottedMemberAccessNode(node) {
    node = new BinOp(node.right, node.op, node.left); // swap left and right
    this.visitMemberAccessNode(node);
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

    this.openNewScope(functionName);

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

    this.closeCurrentScope();
  }

  visitVariablesDeclaration(node) {
    node.children.forEach(varDeclaration => this.visit(varDeclaration));
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

  visitRepeat(node) {
    this.visit(node.count);
    this.visit(node.block);
  }

  visitWhile(node) {
    this.visit(node.condition);
    this.visit(node.block);
  }

  visitFunctionInvocation(node) {
    const functionName = node.id.value;
    const functionSymbol = this.currentScope.lookup(functionName);

    node.args.forEach(arg => this.visit(arg));

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

  visitObjectLiteral(node) {
    this.openNewScope('object');

    node.children.forEach(node => {
      this.visit(node.key); // var declaration
      this.visit(node.value); // expr
    });

    this.closeCurrentScope();
  }
}
