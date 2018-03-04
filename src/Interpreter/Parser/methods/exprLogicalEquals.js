import { EQUALS, NOT, NOT_EQUALS } from '../../Common/constants';
import { BinOp } from '../ASTNodes/BinOp';

// expr_logical_equals : ex (NOT? EQUALS expr1)*
export function eatExprLogicalEquals() {
  const MYSELF = 'eatExprLogicalEquals';
  let left = this.eatHigherPrecedenceExprOf(MYSELF);

  while (this.currentToken.is(EQUALS) || this.currentToken.is(NOT)) {
    let operator;

    if (this.currentToken.is(EQUALS)) {
      operator = this.eatOperator(EQUALS);
    } else {
      this.eat(NOT);
      this.eat(EQUALS);
      operator = new Token(NOT_EQUALS);
    }

    const right = this.eatHigherPrecedenceExprOf(MYSELF);

    left = new BinOp(left, operator, right);
  }

  return left;
}
