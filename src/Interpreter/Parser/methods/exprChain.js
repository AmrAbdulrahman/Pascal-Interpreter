import { OF } from '../../constants';
import { BinOp } from '../../ASTNodes/BinOp';

// expr_chain: ID (of ID)*
export function eatExprChain() {
  let root = this.eatVariable();
  let current = null;

  if (this.currentToken.is(OF)) {
    let operator = this.eatOperator(OF);
    let right = this.eatVariable();

    root = new BinOp(root, operator, right);
    current = root;
  }

  while (this.currentToken.is(OF)) {
    let operator = this.eatOperator(OF);
    let right = this.eatVariable();

    current.right = new BinOp(current.right, operator, right);
    current = current.right;
  }

  return root;
}
