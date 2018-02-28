import { DOT } from '../../constants';
import { BinOp } from '../../ASTNodes/BinOp';

// expr_dotted_chain : something (DOT something)*
export function eatExprDottedChain() {
  const MYSELF = 'eatExprDottedChain';
  let left = this.eatHigherPrecedenceExprOf(MYSELF);

  while (this.currentToken.is(DOT)) {
    const operator = this.eatOperator(DOT);
    const right = this.eatHigherPrecedenceExprOf(MYSELF);

    left = new BinOp(left, operator, right);
  }

  return left;
}
