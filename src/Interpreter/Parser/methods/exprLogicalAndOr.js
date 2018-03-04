import { AND, OR } from '../../Common/constants';
import { BinOp } from '../ASTNodes/BinOp';

// expr_logical_and_or: something ((AND | OR) something)*
export function eatExprLogicalAndOr() {
  const MYSELF = 'eatExprLogicalAndOr';
  let left = this.eatHigherPrecedenceExprOf(MYSELF);

  while (this.currentToken.is(AND, OR)) {
    const operator = this.eatOperator(AND, OR);
    const right = this.eatHigherPrecedenceExprOf(MYSELF);

    left = new BinOp(left, operator, right);
  }

  return left;
}
