import { NAMEOF } from '../../Common/constants';
import { UnaryOp } from '../ASTNodes/UnaryOp';

// expr_nameof : NAMEOF EXPRESSION
export function eatExprNameof() {
  const MYSELF = 'eatExprNameof';
  const rightHand = () => this.eatHigherPrecedenceExprOf(MYSELF);

  if (this.currentToken.is(NAMEOF)) {
      const operator = this.eatOperator(NAMEOF);
      const right = rightHand();
      return new UnaryOp(operator, right);
  }
  
  return rightHand();
}
