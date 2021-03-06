import { IF, THEN, AND, OTHERWISE } from '../../Common/constants';
import { If } from '../ASTNodes/If';

// if_block: if condition THEN? statement_or_block (ELSE IF condition THEN? d cstatement_or_block)* (OTHERWISE statement_or_scopedBlock)?
export function eatIfBlock() {
  const ifs = [];
  let condition = null;
  let body = null;
  let otherwise = null;

  const ifToken = this.currentToken;
  this.eat(IF);
  condition = this.eatCondition();
  this.eatOptional(THEN);
  body = this.eatStatementOrScopedBlock();

  ifs.push({
    condition,
    body,
  });

  // else if*
  while (this.currentToken.is(AND) && this.nextToken().is(IF)) {
    this.eat(AND);
    this.eat(IF);
    condition = this.eatCondition();
    this.eatOptional(THEN);
    body = this.eatStatementOrScopedBlock();

    ifs.push({
      condition,
      body,
    });
  }

  if (this.currentToken.is(OTHERWISE)) {
    this.eat(OTHERWISE);
    otherwise = this.eatStatementOrScopedBlock();
  }

  return new If(ifToken, ifs, otherwise);
}
