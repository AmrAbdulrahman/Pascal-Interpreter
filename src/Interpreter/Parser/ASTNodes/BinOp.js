import { ASTNode } from './ASTNode';

export class BinOp extends ASTNode {
  constructor(left, op, right) {
    super();

    if (!(left instanceof ASTNode) || !(right instanceof ASTNode)) {
      throw new Error('left and right nodes must be an AST instances');
    }

    this.left = left;
    this.right = right;
    this.token = this.op = op;
  }

  valueOf() {
    return `${this.left} ${this.op.value} ${this.right}`;
  }

  get from() {
    return this.left.from;
  }

  get to() {
    return this.right.to;
  }
}
