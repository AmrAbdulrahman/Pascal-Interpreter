import { PLUS, MINUS, OPENBRACE, CLOSEBRACE, STRING_LITERAL,
         INTEGER_CONST, REAL_CONST, ID, OF, OPEN_CURLY_BRACE } from '../../constants';
import { UnaryOp, Str, Num } from '../../ASTNodes/*';


// factor : (PLUS | MINUS) FACTOR
//        | INTEGER_CONST
//        | REAL_CONST
//        | OPENBRACE EXPR CLOSEBRACE
//        | function_invocation
//        | Variable
//        | String
//        | Object_Literal
export function eatExprFactor() {
  const token = this.currentToken;

  // +factor
  if (this.currentToken.is(PLUS)) {
    this.eat(PLUS);
    return new UnaryOp(token, this.eatFactor());
  }

  // -factor
  if (this.currentToken.is(MINUS)) {
    this.eat(MINUS);
    return new UnaryOp(token, this.eatFactor());
  }

  // expr
  if (this.currentToken.is(OPENBRACE)) {
     this.eat(OPENBRACE);
     const exprNode = this.eatExpr();
     this.eat(CLOSEBRACE);
     return exprNode;
  }

  // str
  if (this.currentToken.is(STRING_LITERAL)) {
    this.eat(STRING_LITERAL);
    return new Str(token);
  }

  // INTEGER
  if (this.currentToken.is(INTEGER_CONST, REAL_CONST)) {
    this.eat(INTEGER_CONST, REAL_CONST);
    return new Num(token);
  }

  // id()
  if (this.currentToken.is(ID) && this.nextToken().is(OPENBRACE)) {
    return this.eatFunctionInvocation();
  }

  // expr chain
  if (this.currentToken.is(ID) && this.nextToken().is(OF)) {
    return this.eatExprChain();
  }

  // Var
  if (this.currentToken.is(ID)) {
    return this.eatVariable();
  }

  // object literal
  if (this.currentToken.is(OPEN_CURLY_BRACE)) {
    return this.eatObjectLiteral();
  }

  this.fail('Expected expression');
}
