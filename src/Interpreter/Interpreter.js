import { NodeVisitor } from './NodeVisitor';
import { SemanticAnalyzer } from './SemanticAnalyzer';
import { Scope } from './Scope';
import { BuiltinsScope } from './BuiltinsScope';
import { VarSymbol } from './Symbols/VarSymbol';
import { FunctionSymbol } from './Symbols/FunctionSymbol';
import { Parser } from './Parser';
import { Var, VariableDeclaration } from './ASTNodes/*';
import { CallStack } from './CallStack/CallStack';

import {
  PLUS,
  MINUS,
  MULTIPLY,
  INTEGER_DIVISION,
  FLOAT_DIVISION,
  PRINT,
  EQUALS,
  NOT_EQUALS,
  AND,
  OR,
  LESS_THAN,
  GREATER_THAN,
  LESS_THAN_OR_EQUAL,
  GREATER_THAN_OR_EQUAL,
  OF,
} from './constants';

class Return {
  constructor(value) {
    this.value = value;
  }
}

export class Interpreter extends NodeVisitor {
  constructor(code, {stdin, stdout, stderr}) {
    super();

    this.code = code;
    this.stdin = stdin;
    this.stdout = stdout;
    this.stderr = stderr;
    this.currentScope = new BuiltinsScope();
    this.callStack = new CallStack();
  }

  openNewScope(name) {
    this.currentScope = new Scope(name, this.currentScope);
  }

  closeCurrentScope() {
    this.currentScope = this.currentScope.parent;
  }

  visitProgram(node) {
    const returnValue = this.visitBlock(node);
    return returnValue instanceof Return ? returnValue.value : returnValue;
  }

  visitScopedBlock(node) {
    this.openNewScope('block');

    const blockReturnValue = this.visitBlock(node);

    this.closeCurrentScope();

    return blockReturnValue;
  }

  visitBlock(node) {
    for (let index in node.children) {
      const statement = node.children[index];
      const statementValue = this.visit(statement);

      if (statementValue instanceof Return) {
        return statementValue;
      }
    }
  }

  visitVariableDeclaration(node) {
    //const typeName = node.type.value;
    //const typeSymbol = this.currentScope.lookup(typeName);
    const varName = node.variable.value;
    const varSymbol = new VarSymbol(varName, null);

    this.currentScope.insert(varSymbol);
  }

  visitAssign(node) {
    const varName = node.left.value;
    const value = this.visit(node.right);

    this.currentScope
      .lookup(varName)
      .setValue(value);

    return value;
  }

  visitNoOp(node) {
    // do nothing here, void, blackhole...
  }

  visitVar(node) {
    return this.currentScope
      .lookup(node.value)
      .getValue();
  }

  visitBinOp(node) {
    if (node.op.type === OF) {
      return this.visitMemberAccessNode(node);
    }

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
      case EQUALS:
        return left === right;
      case NOT_EQUALS:
        return left !== right;
      case AND:
        return !!(left && right);
      case OR:
        return !!(left || right);
      case LESS_THAN:
        return left < right;
      case GREATER_THAN:
        return left > right;
      case LESS_THAN_OR_EQUAL:
        return left <= right;
      case GREATER_THAN_OR_EQUAL:
        return left >= right;

      default:
        throw new Error(`Unhandled operator type ${node.op.type}`);
    }
  }

  visitMemberAccessNode(node) {
    const right = this.visit(node.right);
    const leftName = node.left.value;

    if (right instanceof Object === false) {
      throw new Error(`Can't call '${leftName}' of '${right}' because '${right}' is not an object`);
    }


    if (Object
        .keys(right)
        .map(k => k.toLowerCase())
        .indexOf(leftName.toLowerCase()) === -1) {

      throw new Error(`object has no property '${leftName}'`);
    }

    return right[leftName];
  }

  visitNum(node) {
    return node.value;
  }

  visitStr(node) {
    return node.value;
  }

  visitUnaryOp(node) {
    return (node.op.type === PLUS ? 1 : -1) * this.visit(node.expr);
  }

  visitReturn(node) {
    return new Return(this.visit(node.expr));
  }

  visitFunctionDecl(node) {
    const functionName = node.id.value;
    const functionSymbol = new FunctionSymbol(functionName, node.block);

    this.currentScope.insert(functionSymbol);

    this.openNewScope(functionName);

    functionSymbol.setScope(this.currentScope);

    // declare params
    node.params.forEach(param => {
      const paramName = param.value;
      const paramSymbol = new VarSymbol(paramName, null);

      this.currentScope.insert(paramSymbol);
      functionSymbol.params.push(paramSymbol);
    });

    // visit all declaration nodes inside the function
    this.visitFunctionLocalDeclarations(node.block);

    this.closeCurrentScope();
  }

  visitFunctionLocalDeclarations(node) {
    for (let index in node.children) {
      const statement = node.children[index];

      // declare variables
      if (statement instanceof VariableDeclaration) {
        this.visit(statement);
      }
    }
  }

  visitFunctionInvocation(node) {
    const functionName = node.id.value;
    const functionSymbol = this.currentScope.lookup(functionName);

    if (functionName === PRINT) {
      return this.print(node);
    }

    const functionScope = functionSymbol.getScope();

    // 1) save locally declared variables state
    const functionVarSymbols = functionScope.getOwnVarSymbols();
    this.callStack.push(functionVarSymbols);

    // 2) evaluate function args before switching scopes
    const evaluatedArgs = node.args.map(arg => this.visit(arg));

    // 3) set current scope to function scope
    const initialCurrentScope = this.currentScope;
    this.currentScope = functionScope;

    // 4) evaluate and set function args
    functionSymbol.params.forEach((param, index) => {
      const paramName = param.name;
      const argSymbol = functionScope.lookup(paramName);
      const argValue = evaluatedArgs[index];

      argSymbol.setValue(argValue);
    });

    // 5) execute function body
    const returnValue = this.visit(functionSymbol.block);

    // 6) restore local variables state
    this.callStack.pull();

    // 7) set back currentScope
    this.currentScope = initialCurrentScope;

    return returnValue instanceof Return ? returnValue.value : returnValue;
  }

  visitIf(node) {
    for (var i = 0; i < node.ifs.length; i++) {
      const { condition, body } = node.ifs[i];
      const conditionValue = this.visit(condition);

      if (conditionValue === true) {
        return this.visit(body);
      }
    }

    if (node.otherwise) {
      return this.visit(node.otherwise);
    }
  }

  visitCondition(node) {
    return !!this.visit(node.expr);
  }

  visitObjectLiteral(node) {
    this.openNewScope('object');

    const obj = {};

    node.children.forEach(node => {
      // calculate the value before declaring the variable
      // to handle dependency on the same variable name
      const value = this.visit(node.value);

      // declare the variable
      this.visit(node.key);

      const varName = node.key.variable.value;

      // set variable value in current scope
      this.currentScope
        .lookup(varName)
        .setValue(value);

      // construct object
      obj[varName] = value;
    });

    this.closeCurrentScope();

    return obj;
  }

  print(node) {
    const output = node.args
      .map(arg => this.visit(arg))
      .map(argVal => argVal instanceof Object ? JSON.stringify(argVal) : argVal)
      .join(' ');

    this.stdout.write(`${output}\n`);
  }

  // run semantic analysis
  validate({delegateEx} = {delegateEx: false}) {
    try {
      this.stdout.write('Parsing...');
      const ast = (new Parser(this.code)).parse();
      this.stdout.write('Parsing: Ok');

      this.stdout.write('Running semantic checks...');
      (new SemanticAnalyzer()).visit(ast);
      this.stdout.write('Semantic checks: Ok');

      return ast;
    } catch(ex) {
      if (delegateEx) throw ex;
      this.stderr.write('Code validation fails');
      this.stderr.write(ex);
    }
  }

  interpret() {
    try {
      const ast = this.validate({delegateEx: true});

      this.stdout.write('Executing code...');
      this.stdout.write('');

      const returnValue = this.visit(ast);

      if (returnValue !== undefined) {
        this.stdout.write(returnValue);
      }

      return returnValue;
    } catch (ex) {
      //console.log(ex);
      this.stderr.write(ex);
    }
  }
}
