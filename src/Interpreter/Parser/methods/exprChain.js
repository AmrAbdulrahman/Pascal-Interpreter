import { OF } from '../../constants';
import { BinOp } from '../../ASTNodes/BinOp';

// expr_chain: ID (of ID)*
export function eatExprChain() {
  const MYSELF = 'eatExprChain';
  const eatOperand = () => this.eatHigherPrecedenceExprOf(MYSELF);

  let root = eatOperand();
  let current = null;

  if (this.currentToken.is(OF)) {
    let operator = this.eatOperator(OF);
    let right = eatOperand();

    root = new BinOp(root, operator, right);
    current = root;
  }

  while (this.currentToken.is(OF)) {
    let operator = this.eatOperator(OF);
    let right = eatOperand();

    current.right = new BinOp(current.right, operator, right);
    current = current.right;
  }

  return root;
}
