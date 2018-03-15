import {
  IF, WHILE, REPEAT, ID, OPENBRACE, RETURN, CREATE, FUNCTION, BREAK, CONTINUE, OPEN_CURLY_BRACE,
} from '../../Common/constants';

// statement : assignment_statement
//           | function_invocation
//           | break
//           | continue
//           | return_statement
//           | if_block
//           | repeat_block
//           | while_block
//           | var_declaration
//           | function_declaration
//           | empty

export function eatStatement() {
  if (this.currentToken.is(BREAK)) {
    return this.eatBreak();
  }

  if (this.currentToken.is(CONTINUE)) {
    return this.eatContinue();
  }

  if (this.currentToken.is(IF)) {
    return this.eatIfBlock();
  }

  if (this.currentToken.is(REPEAT)) {
    return this.eatRepeatBlock();
  }

  if (this.currentToken.is(WHILE)) {
    return this.eatWhileBlock();
  }

  if (this.currentToken.is(ID) && this.nextToken().is(OPENBRACE)) {
    return this.eatFunctionInvocation();
  }

  if (this.currentToken.is(ID)) {
    return this.eatAssignmentStatement();
  }

  if (this.currentToken.is(RETURN)) {
    return this.eatReturnStatement();
  }

  if (this.currentToken.is(CREATE)) {
    return this.eatVariablesDeclaration();
  }

  if (this.currentToken.is(FUNCTION)) {
    return this.eatFunctionDeclaration();
  }

  return this.eatEmpty();
}
