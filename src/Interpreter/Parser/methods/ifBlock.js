import { IF, THEN, AND, OTHERWISE } from '../../constants';
import { If } from '../../ASTNodes/If';

// if_block: if OPENBRACE condition CLOSEBRACE statement_or_block (ELSE IF condition statement_or_block)* (OTHERWISE statement_or_block)?
export function eatIfBlock() {
  const ifs = [];
  let condition = null;
  let body = null;
  let otherwise = null;

  this.eat(IF);
  condition = this.eatCondition();
  this.eat(THEN);
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
    this.eat(THEN);
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

  return new If(ifs, otherwise);
}
