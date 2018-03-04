import { ID, OPENBRACE, CLOSEBRACE, COMMA } from '../../Common/constants';
import { FunctionInvocation } from '../ASTNodes/FunctionInvocation';

// function_invocation: ID OPENBRACE args_list CLOSEBRACE
export function eatFunctionInvocation() {
  const functionName = this.currentToken;
  const args = [];

  this.eat(ID);
  this.eat(OPENBRACE);

  // (arg (comma arg)*)
  if (!this.currentToken.is(CLOSEBRACE)) { // there's at least one param
    args.push(this.eatExpr()); // first arg

    while (this.currentToken.is(COMMA)) { // then read pairs (COMMA ARG)
      this.eat(COMMA);
      args.push(this.eatExpr());
    }
  }

  this.eat(CLOSEBRACE);

  return new FunctionInvocation(functionName, args);
}
