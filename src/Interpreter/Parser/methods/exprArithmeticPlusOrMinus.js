import { PLUS, MINUS } from '../../Common/constants';
import { BinOp } from '../ASTNodes/BinOp';

// expr_arithmetic_plus : something ((PLUS | MINUS) something)*
export function eatExprArithmeticPlusOrMinus() {
  const MYSELF = 'eatExprArithmeticPlusOrMinus';
  let left = this.eatHigherPrecedenceExprOf(MYSELF);

  while (this.currentToken.is(PLUS, MINUS)) {
    const operator = this.eatOperator(PLUS, MINUS);
    const right = this.eatHigherPrecedenceExprOf(MYSELF);

    left = new BinOp(left, operator, right);
  }

  return left;
}
