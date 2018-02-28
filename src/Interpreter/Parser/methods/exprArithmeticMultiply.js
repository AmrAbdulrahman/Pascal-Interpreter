import { MULTIPLY, DIVISION } from '../../constants';
import { BinOp } from '../../ASTNodes/BinOp';

// expr_arithmetic_multiply : something ((MUL | DIV) something)*
export function eatExprArithmeticMultiply() {
  const MYSELF = 'eatExprArithmeticMultiply';
  let left = this.eatHigherPrecedenceExprOf(MYSELF);

  while (this.currentToken.is(MULTIPLY, DIVISION)) {
    const operator = this.eatOperator(MULTIPLY, DIVISION);
    const right = this.eatHigherPrecedenceExprOf(MYSELF);

    left = new BinOp(left, operator, right);
  }

  return left;
}
